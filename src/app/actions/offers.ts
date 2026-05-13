"use server";

import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function getOffers() {
  try {
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching offers:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Exception fetching offers:", error);
    return [];
  }
}

export async function getActiveOffer() {
  try {
    const now = new Date().toISOString();
    // Using supabaseAdmin to ensure the homepage can always fetch the active offer bypassing RLS
    const { data, error } = await supabaseAdmin
      .from("offers")
      .select("*")
      .eq("is_active", true)
      .lte("start_date", now)
      .gte("end_date", now)
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is fine
      console.error("Error fetching active offer:", error);
      return null;
    }
    return data || null;
  } catch (error) {
    console.error("Exception fetching active offer:", error);
    return null;
  }
}

export async function createOffer(offerData: { title: string; description: string; discount_percentage: number; start_date: string; end_date: string; }) {
  try {
    // Using supabaseAdmin to bypass RLS for administrative insert
    const { error } = await supabaseAdmin
      .from("offers")
      .insert([offerData]);

    if (error) throw error;
    
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating offer:", error);
    return { success: false, error: error.message };
  }
}

export async function updateOfferStatus(id: string, is_active: boolean) {
  try {
    // If activating an offer, we should deactivate others to ensure only one banner exists
    if (is_active) {
      await supabaseAdmin.from("offers").update({ is_active: false }).neq("id", id); // deactivate others
    }

    const { error } = await supabaseAdmin
      .from("offers")
      .update({ is_active })
      .eq("id", id);

    if (error) throw error;
    
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating offer status:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteOffer(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("offers")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting offer:", error);
    return { success: false, error: error.message };
  }
}
