"use server";

import { supabase } from "@/lib/supabase";

export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Exception fetching products:", error);
    return [];
  }
}

export async function addProduct(product: { name: string, brand: string, price: number, stock: number }) {
  try {
    const { error } = await supabase
      .from("products")
      .insert([product]);

    if (error) {
      console.error("Error adding product:", error.message, error.details);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Exception adding product:", error);
    return { success: false, error: error.message || "An exception occurred" };
  }
}

export async function deleteProduct(id: string) {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      return { success: false, error: "Failed to delete product" };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception deleting product:", error);
    return { success: false, error: "An exception occurred" };
  }
}
