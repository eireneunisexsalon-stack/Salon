"use server";

import { supabase } from "@/lib/supabase";

export async function createBooking(data: {
  customer_name: string;
  phone_number: string;
  service_name: string;
  booking_date: string;
  time_slot: string;
  deposit_amount?: number;
  total_amount?: number;
  status?: string;
  user_id?: string;
  receipt_url?: string;
  payment_method?: string;
  is_walkin?: boolean;
  notes?: string;
}) {
  try {
    // Get all services to map categories
    const { data: services } = await supabase.from("services").select("name, category");
    const serviceMap = new Map(services?.map(s => [s.name, s.category]) || []);
    
    // Split requested services and get their categories
    const requestedServices = data.service_name.split(", ").map(s => s.trim());
    const requestedCategories = new Set(requestedServices.map(s => serviceMap.get(s)).filter(Boolean));

    // Check if slot is already booked for that date/time
    const { data: existingBookings, error: checkError } = await supabase
      .from("bookings")
      .select("id, service_name")
      .eq("booking_date", data.booking_date)
      .eq("time_slot", data.time_slot)
      .in("status", ["pending", "confirmed", "pending_verification"]);
    
    if (checkError) {
      console.error("Check booking error:", {
        message: checkError.message,
        details: checkError.details,
        hint: checkError.hint,
        code: checkError.code
      });
      return { success: false, error: "Failed to check slot availability" };
    }
    
    // Find if there's an existing booking that conflicts with ANY of the requested categories
    const conflict = existingBookings?.find(b => {
      const existingServices = b.service_name.split(", ").map((s: string) => s.trim());
      return existingServices.some((s: string) => requestedCategories.has(serviceMap.get(s)));
    });

    if (conflict) {
      return { success: false, error: "One or more selected services conflict with an existing booking in the same category." };
    }
    
    // Insert the new booking
    const { data: newBooking, error: insertError } = await supabase
      .from("bookings")
      .insert([
        {
          customer_name: data.customer_name,
          phone_number: data.phone_number,
          service_name: data.service_name,
          booking_date: data.booking_date,
          time_slot: data.time_slot,
          deposit_amount: data.deposit_amount || 0,
          total_amount: data.total_amount || 0,
          status: data.status || "pending",
          user_id: data.user_id || null,
          receipt_url: data.receipt_url || null,
          payment_method: data.payment_method || "Online",
          is_walkin: data.is_walkin || false,
          notes: data.notes || null
        }
      ])
      .select("id")
      .single();
      
    if (insertError) {
      console.error("Insert booking error:", {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
      return { success: false, error: `Failed to create booking: ${insertError.message}` };
    }
    
    // Add pending wallet transaction for the 10% advance
    if (newBooking?.id && data.deposit_amount) {
      await supabase.from("wallet_transactions").insert([
        {
          booking_id: newBooking.id,
          amount: data.deposit_amount,
          type: "credit",
          status: (data.is_walkin || data.status === 'confirmed') ? "success" : "pending",
          description: data.is_walkin 
            ? `Walk-in payment via ${data.payment_method || 'Cash'}`
            : `Advance 10% payment for booking ${newBooking.id}`
        }
      ]);
    }
    
    return { success: true, id: newBooking.id };
  } catch (error) {
    console.error("Server action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getBookedSlots(date: string, category: string) {
  try {
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("time_slot, service_name")
      .eq("booking_date", date)
      .in("status", ["pending", "confirmed", "pending_verification"]);
      
    if (error || !bookings) return [];

    const { data: services } = await supabase
      .from("services")
      .select("name, category");

    if (!services) return [];

    const serviceCategoryMap = new Map(services.map(s => [s.name, s.category]));

    const categoryBookings = bookings.filter(b => {
      const existingServices = b.service_name.split(", ").map((s: string) => s.trim());
      return existingServices.some((s: string) => serviceCategoryMap.get(s) === category);
    });

    return categoryBookings.map(b => b.time_slot);
  } catch (error) {
    console.error("Exception fetching booked slots:", error);
    return [];
  }
}

export async function getServicesForBooking() {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("category", { ascending: true })
      .order("price", { ascending: true });

    if (error) {
      console.error("Error fetching services for booking:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Exception fetching services:", error);
    return [];
  }
}
