"use server";

import { supabase } from "@/lib/supabase";

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
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .eq("is_active", true)
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

export async function createOffer(offerData: { title: string; description: string; discount_percentage: number }) {
  try {
    const { error } = await supabase
      .from("offers")
      .insert([offerData]);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error creating offer:", error);
    return { success: false, error: error.message };
  }
}

export async function updateOfferStatus(id: string, is_active: boolean) {
  try {
    // If activating an offer, we should ideally deactivate others to ensure only one banner exists, 
    // but for simplicity we'll just update this one. The getActiveOffer limits to 1 anyway.
    if (is_active) {
      await supabase.from("offers").update({ is_active: false }).neq("id", "00000000-0000-0000-0000-000000000000"); // deactivate all others
    }

    const { error } = await supabase
      .from("offers")
      .update({ is_active })
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error updating offer status:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteOffer(id: string) {
  try {
    const { error } = await supabase
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
