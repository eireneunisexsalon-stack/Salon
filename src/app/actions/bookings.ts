"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function deleteBooking(bookingId: string, userId: string) {
  try {
    // Soft delete: just mark as deleted by user so it stays in DB but hidden from client
    const { error } = await supabaseAdmin
      .from("bookings")
      .update({ is_deleted_by_user: true })
      .eq("id", bookingId)
      .eq("user_id", userId);

    if (error) throw error;
    
    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Error hiding booking:", error);
    return { success: false, error: error.message };
  }
}

export async function autoCleanupOldBookings() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dateStr = sevenDaysAgo.toISOString().split('T')[0];

    const { error } = await supabaseAdmin
      .from("bookings")
      .delete()
      .eq("status", "completed")
      .lt("booking_date", dateStr);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Auto-cleanup failed:", error);
    return { success: false };
  }
}
