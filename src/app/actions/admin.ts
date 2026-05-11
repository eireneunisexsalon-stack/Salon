"use server";

import { supabase } from "@/lib/supabase";
import { seedServices as comprehensiveSeed } from './seed';

export async function getBookings() {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Exception fetching bookings:", error);
    return [];
  }
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating booking:", error);
      return { success: false, error: "Failed to update status" };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception updating booking:", error);
    return { success: false, error: "An exception occurred" };
  }
}

export async function getServices() {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("category", { ascending: true })
      .order("price", { ascending: true });

    if (error) {
      console.error("Error fetching services:", {
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

export async function addService(service: { name: string, price: number, category: string, duration_mins: number }) {
  try {
    const { error } = await supabase
      .from("services")
      .insert([service]);

    if (error) {
      console.error("Error adding service:", error);
      return { success: false, error: "Failed to add service" };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception adding service:", error);
    return { success: false, error: "An exception occurred" };
  }
}

export async function deleteService(id: string) {
  try {
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting service:", error);
      return { success: false, error: "Failed to delete service" };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception deleting service:", error);
    return { success: false, error: "An exception occurred" };
  }
}

export async function getWalletData() {
  try {
    const { data, error } = await supabase
      .from("wallet_transactions")
      .select(`
        *,
        bookings (
          customer_name,
          service_name,
          booking_date
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching wallet data:", error);
      return { transactions: [], balance: 0 };
    }

    const balance = (data || []).reduce((acc, curr) => {
      return curr.type === 'credit' ? acc + curr.amount : acc - curr.amount;
    }, 0);

    return { transactions: data || [], balance };
  } catch (error) {
    console.error("Exception fetching wallet data:", error);
    return { transactions: [], balance: 0 };
  }
}

export async function verifyPaymentManually(bookingId: string) {
  try {
    // 1. Get booking details
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) throw new Error("Booking not found");

    // 2. Update booking status
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        status: "confirmed",
        payment_status: "paid" // This tracks the deposit
      })
      .eq("id", bookingId);

    if (updateError) throw updateError;

    // 3. Record Wallet Transaction (only the deposit amount)
    const { error: txError } = await supabase
      .from("wallet_transactions")
      .insert([
        {
          booking_id: bookingId,
          amount: booking.deposit_amount || 0,
          type: "credit",
          status: "success",
          description: `Advance 10% payment for booking ${bookingId}`
        }
      ]);

    if (txError) throw txError;

    return { success: true };
  } catch (error: any) {
    console.error("Manual verification error:", error);
    return { success: false, error: error.message };
  }
}

export async function seedServices() {
  return comprehensiveSeed();
}
