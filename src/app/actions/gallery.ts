"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function getGalleryImages() {
  try {
    const { data, error } = await supabaseAdmin
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
}

export async function uploadGalleryImage(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error("No file provided");

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // 1. Upload to Supabase Storage using Admin Client
    const { error: uploadError } = await supabaseAdmin.storage
      .from('gallery')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('gallery')
      .getPublicUrl(filePath);

    console.log("DEBUG: Gallery Image Public URL ->", publicUrl);

    // 3. Save to Database using Admin Client
    const { error: dbError } = await supabaseAdmin
      .from('gallery')
      .insert([{ url: publicUrl, alt: file.name }]);

    if (dbError) throw dbError;

    revalidatePath("/");
    revalidatePath("/gallery");
    return { success: true };
  } catch (error: any) {
    console.error('Upload error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteGalleryImage(id: string, url: string) {
  try {
    const path = url.split('/').pop();
    if (!path) throw new Error('Invalid file path');

    // 1. Delete from Storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('gallery')
      .remove([path]);

    if (storageError) throw storageError;

    // 2. Delete from Database
    const { error: dbError } = await supabaseAdmin
      .from('gallery')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    revalidatePath("/");
    revalidatePath("/gallery");
    return { success: true };
  } catch (error: any) {
    console.error('Delete error:', error);
    return { success: false, error: error.message };
  }
}
