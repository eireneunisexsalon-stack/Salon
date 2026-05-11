"use server";

import { supabase } from "@/lib/supabase";

export async function getStaff() {
  try {
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching staff:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Exception fetching staff:", error);
    return [];
  }
}

export async function addStaff(staffMember: { name: string, role: string, phone: string, salary: number }) {
  try {
    const { error } = await supabase
      .from("staff")
      .insert([staffMember]);

    if (error) {
      console.error("Error adding staff:", error);
      return { success: false, error: "Failed to add staff member" };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception adding staff:", error);
    return { success: false, error: "An exception occurred" };
  }
}

export async function deleteStaff(id: string) {
  try {
    const { error } = await supabase
      .from("staff")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting staff:", error);
      return { success: false, error: "Failed to delete staff member" };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception deleting staff:", error);
    return { success: false, error: "An exception occurred" };
  }
}
