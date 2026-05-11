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
}) {
  try {
    // Check if slot is already booked for that date/time
    const { data: existingBooking, error: checkError } = await supabase
      .from("bookings")
      .select("id")
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
    
    if (existingBooking && existingBooking.length > 0) {
      return { success: false, error: "This time slot is already booked. Please choose another." };
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
          user_id: data.user_id || null
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
      return { success: false, error: "Failed to create booking" };
    }
    
    return { success: true, id: newBooking.id };
  } catch (error) {
    console.error("Server action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getBookedSlots(date: string) {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("time_slot")
      .eq("booking_date", date)
      .in("status", ["pending", "confirmed"]);
      
    if (error) {
      console.error("Error fetching booked slots:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return [];
    }
    
    return data ? data.map(b => b.time_slot) : [];
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
