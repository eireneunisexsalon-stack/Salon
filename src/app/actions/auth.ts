"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) return { success: false, error: error.message };
  
  revalidatePath("/");
  return { success: true };
}

export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getUserBookings() {
  const user = await getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", user.id)
    .order("booking_date", { ascending: false });

  if (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }

  return data || [];
}
