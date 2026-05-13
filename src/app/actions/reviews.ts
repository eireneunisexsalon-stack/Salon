"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function submitReview(reviewData: {
  user_id: string;
  customer_name: string;
  rating: number;
  comment: string;
}) {
  try {
    const { error } = await supabaseAdmin
      .from("reviews")
      .insert([reviewData]);

    if (error) throw error;
    
    revalidatePath("/profile");
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error: any) {
    console.error("Error submitting review:", error);
    return { success: false, error: error.message };
  }
}

export async function getReviews() {
  try {
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export async function getPublishedReviews() {
  try {
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching published reviews:", error);
    return [];
  }
}

export async function deleteReview(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting review:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleReviewVisibility(id: string, is_published: boolean) {
  try {
    const { error } = await supabaseAdmin
      .from("reviews")
      .update({ is_published })
      .eq("id", id);

    if (error) throw error;
    
    revalidatePath("/");
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error: any) {
    console.error("Error toggling review visibility:", error);
    return { success: false, error: error.message };
  }
}
