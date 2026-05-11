import { createClient } from '@supabase/supabase-js';

export async function seedServices() {
  const allServices = [
    // ==========================================
    // ✨ WOMEN'S SALON MENU
    // ==========================================
    
    // --- Threading (Women) ---
    { name: "Eyebrow Threading (Women)", category: "Women", price: 40, duration_mins: 10 },
    { name: "Forehead Threading (Women)", category: "Women", price: 20, duration_mins: 10 },
    { name: "Upper Lips Threading (Women)", category: "Women", price: 20, duration_mins: 5 },
    { name: "Chin Threading (Women)", category: "Women", price: 20, duration_mins: 5 },
    { name: "Full Face Threading (Women)", category: "Women", price: 200, duration_mins: 30 },

    // --- Face Wax (Bean Wax - Women) ---
    { name: "Bean Wax: Upper Lips (Women)", category: "Waxing", price: 50, duration_mins: 10 },
    { name: "Bean Wax: Forehead (Women)", category: "Waxing", price: 50, duration_mins: 10 },
    { name: "Bean Wax: Chin (Women)", category: "Waxing", price: 50, duration_mins: 10 },
    { name: "Bean Wax: Nose (Women)", category: "Waxing", price: 50, duration_mins: 5 },
    { name: "Bean Wax: Side Locks (Women)", category: "Waxing", price: 150, duration_mins: 15 },
    { name: "Bean Wax: Full Face (Women)", category: "Waxing", price: 450, duration_mins: 30 },

    // --- Body Wax (Women) ---
    // Honey Wax
    { name: "Honey Wax: Under Arms (Women)", category: "Waxing", price: 70, duration_mins: 15 },
    { name: "Honey Wax: Hand (Women)", category: "Waxing", price: 150, duration_mins: 30 },
    { name: "Honey Wax: Half Legs (Women)", category: "Waxing", price: 150, duration_mins: 30 },
    { name: "Honey Wax: Stomach (Women)", category: "Waxing", price: 150, duration_mins: 20 },
    { name: "Honey Wax: Back (Women)", category: "Waxing", price: 200, duration_mins: 30 },
    { name: "Honey Wax: Full Legs (Women)", category: "Waxing", price: 300, duration_mins: 45 },
    { name: "Honey Wax: Full Body (Women)", category: "Waxing", price: 800, duration_mins: 90 },
    // Milk Wax
    { name: "Milk Wax: Under Arms (Women)", category: "Waxing", price: 100, duration_mins: 15 },
    { name: "Milk Wax: Hand (Women)", category: "Waxing", price: 200, duration_mins: 30 },
    { name: "Milk Wax: Half Legs (Women)", category: "Waxing", price: 200, duration_mins: 30 },
    { name: "Milk Wax: Stomach (Women)", category: "Waxing", price: 200, duration_mins: 20 },
    { name: "Milk Wax: Back (Women)", category: "Waxing", price: 250, duration_mins: 30 },
    { name: "Milk Wax: Full Legs (Women)", category: "Waxing", price: 400, duration_mins: 45 },
    { name: "Milk Wax: Full Body (Women)", category: "Waxing", price: 1200, duration_mins: 100 },
    // Rica Wax
    { name: "Rica Wax: Under Arms (Women)", category: "Waxing", price: 200, duration_mins: 15 },
    { name: "Rica Wax: Hand (Women)", category: "Waxing", price: 300, duration_mins: 30 },
    { name: "Rica Wax: Half Legs (Women)", category: "Waxing", price: 300, duration_mins: 30 },
    { name: "Rica Wax: Stomach (Women)", category: "Waxing", price: 300, duration_mins: 20 },
    { name: "Rica Wax: Back (Women)", category: "Waxing", price: 350, duration_mins: 30 },
    { name: "Rica Wax: Full Legs (Women)", category: "Waxing", price: 500, duration_mins: 45 },
    { name: "Rica Wax: Full Body (Women)", category: "Waxing", price: 2000, duration_mins: 120 },
    // Bikini Wax
    { name: "Bikini Wax: Honey (Women)", category: "Waxing", price: 500, duration_mins: 45 },
    { name: "Bikini Wax: Milk (Women)", category: "Waxing", price: 700, duration_mins: 45 },
    { name: "Bikini Wax: Rica (Women)", category: "Waxing", price: 1200, duration_mins: 60 },

    // --- Facial & Cleanup (Women) ---
    { name: "VLCC Cleanup (Women)", category: "Facial", price: 300, duration_mins: 30 },
    { name: "VLCC Facial (Women)", category: "Facial", price: 500, duration_mins: 60 },
    { name: "Whitening Cleanup (Women)", category: "Facial", price: 450, duration_mins: 30 },
    { name: "Whitening Facial (Women)", category: "Facial", price: 700, duration_mins: 60 },
    { name: "Vitamin C Cleanup (Women)", category: "Facial", price: 450, duration_mins: 30 },
    { name: "Vitamin C Facial (Women)", category: "Facial", price: 700, duration_mins: 60 },
    { name: "Lotus Gold Cleanup (Women)", category: "Facial", price: 650, duration_mins: 30 },
    { name: "Lotus Gold Facial (Women)", category: "Facial", price: 900, duration_mins: 60 },
    { name: "Lotus Diamond Cleanup (Women)", category: "Facial", price: 700, duration_mins: 30 },
    { name: "Lotus Diamond Facial (Women)", category: "Facial", price: 1000, duration_mins: 60 },
    { name: "Aroma Gold Cleanup (Women)", category: "Facial", price: 550, duration_mins: 30 },
    { name: "Aroma Gold Facial (Women)", category: "Facial", price: 850, duration_mins: 60 },
    { name: "Aroma Diamond Cleanup (Women)", category: "Facial", price: 650, duration_mins: 30 },
    { name: "Aroma Diamond Facial (Women)", category: "Facial", price: 950, duration_mins: 60 },
    { name: "Aquaglow Gold Cleanup (Women)", category: "Facial", price: 700, duration_mins: 30 },
    { name: "Aquaglow Gold Facial (Women)", category: "Facial", price: 1000, duration_mins: 60 },
    { name: "Aquaglow Diamond Cleanup (Women)", category: "Facial", price: 800, duration_mins: 30 },
    { name: "Aquaglow Diamond Facial (Women)", category: "Facial", price: 1200, duration_mins: 60 },
    { name: "O3 Facial (Women)", category: "Facial", price: 1500, duration_mins: 75 },

    // --- Luxury / Bridal Facials (Women) ---
    { name: "O3 Bridal Facial (Women)", category: "Facial", price: 2500, duration_mins: 90 },
    { name: "Aroma Magic Skin (Women)", category: "Facial", price: 2000, duration_mins: 75 },
    { name: "Aroma Magic Bridal (Women)", category: "Facial", price: 2500, duration_mins: 90 },
    { name: "Kanpeki Facial (Women)", category: "Facial", price: 3500, duration_mins: 90 },

    // --- D-Tan & Bleach (Women) ---
    { name: "Aquaglow D-Tan (Women)", category: "Skincare", price: 350, duration_mins: 30 },
    { name: "Ragga D-Tan (Women)", category: "Skincare", price: 450, duration_mins: 30 },
    { name: "O3 D-Tan (Women)", category: "Skincare", price: 550, duration_mins: 30 },
    { name: "Power Mask D-Tan (Women)", category: "Skincare", price: 800, duration_mins: 45 },

    // --- Manicure & Pedicure (Women) ---
    { name: "Manicure: Normal (Women)", category: "Mani/Pedi", price: 450, duration_mins: 45 },
    { name: "Pedicure: Normal (Women)", category: "Mani/Pedi", price: 650, duration_mins: 60 },
    { name: "Manicure: Ragga (Women)", category: "Mani/Pedi", price: 600, duration_mins: 45 },
    { name: "Pedicure: Ragga (Women)", category: "Mani/Pedi", price: 800, duration_mins: 60 },
    { name: "Manicure: Jelly (Women)", category: "Mani/Pedi", price: 700, duration_mins: 60 },
    { name: "Pedicure: Jelly (Women)", category: "Mani/Pedi", price: 1000, duration_mins: 75 },
    { name: "Manicure: O3 (Women)", category: "Mani/Pedi", price: 1000, duration_mins: 75 },
    { name: "Pedicure: O3 (Women)", category: "Mani/Pedi", price: 2500, duration_mins: 90 },

    // --- Massage (Women) ---
    { name: "Body Massage (30 min - Women)", category: "Massage", price: 2000, duration_mins: 30 },
    { name: "Body Massage (45 min - Women)", category: "Massage", price: 2500, duration_mins: 45 },
    { name: "Body Cream Massage (30 min - Women)", category: "Massage", price: 2500, duration_mins: 30 },
    { name: "Body Cream Massage (45 min - Women)", category: "Massage", price: 3000, duration_mins: 45 },
    { name: "Foot Massage (30 min - Women)", category: "Massage", price: 500, duration_mins: 30 },
    { name: "Foot Massage (45 min - Women)", category: "Massage", price: 700, duration_mins: 45 },
    { name: "Back Massage (30 min - Women)", category: "Massage", price: 400, duration_mins: 30 },
    { name: "Back Massage (45 min - Women)", category: "Massage", price: 550, duration_mins: 45 },

    // --- Hair Spa (Women) ---
    { name: "Hair Spa: Keratin (Women)", category: "Hair Spa", price: 500, duration_mins: 60 },
    { name: "Hair Spa: Loreal (Women)", category: "Hair Spa", price: 800, duration_mins: 60 },
    { name: "Hair Spa: Brazilian (Women)", category: "Hair Spa", price: 1000, duration_mins: 60 },
    { name: "Hair Spa: Anti-Dandruff (Women)", category: "Hair Spa", price: 800, duration_mins: 60 },
    { name: "Hair Spa: Anti-Hairfall (Women)", category: "Hair Spa", price: 1000, duration_mins: 60 },

    // --- Hair Wash (Women) ---
    { name: "Normal Hair Wash (Women)", category: "Hair Care", price: 150, duration_mins: 15 },
    { name: "Streax Canvo Wash (Women)", category: "Hair Care", price: 300, duration_mins: 20 },
    { name: "Loreal Hair Wash (Women)", category: "Hair Care", price: 500, duration_mins: 20 },

    // --- Haircuts (Women) ---
    { name: "Normal Cut (Women)", category: "Women", price: 350, duration_mins: 45 },
    { name: "U Cut (Women)", category: "Women", price: 350, duration_mins: 45 },
    { name: "V Cut (Women)", category: "Women", price: 350, duration_mins: 45 },
    { name: "Straight Cut (Women)", category: "Women", price: 350, duration_mins: 45 },
    { name: "Advance Haircut (Women)", category: "Women", price: 500, duration_mins: 60 },

    // --- Hair Treatments (Women) ---
    // Keratin
    { name: "Keratin (Short - Women)", category: "Hair Treatments", price: 1500, duration_mins: 120 },
    { name: "Keratin (Medium - Women)", category: "Hair Treatments", price: 2000, duration_mins: 150 },
    { name: "Keratin (Long - Women)", category: "Hair Treatments", price: 3500, duration_mins: 180 },
    // Botox
    { name: "Botox (Short - Women)", category: "Hair Treatments", price: 4500, duration_mins: 120 },
    { name: "Botox (Medium - Women)", category: "Hair Treatments", price: 5500, duration_mins: 150 },
    { name: "Botox (Long - Women)", category: "Hair Treatments", price: 6500, duration_mins: 180 },
    // Nanoplastia
    { name: "Nanoplastia (Short - Women)", category: "Hair Treatments", price: 5000, duration_mins: 150 },
    { name: "Nanoplastia (Medium - Women)", category: "Hair Treatments", price: 7000, duration_mins: 180 },
    { name: "Nanoplastia (Long - Women)", category: "Hair Treatments", price: 8000, duration_mins: 210 },
    // Bond Treatments
    { name: "Kera Bond (Short - Women)", category: "Hair Treatments", price: 3000, duration_mins: 180 },
    { name: "Kera Bond (Medium - Women)", category: "Hair Treatments", price: 4000, duration_mins: 210 },
    { name: "Kera Bond (Long - Women)", category: "Hair Treatments", price: 6000, duration_mins: 240 },
    { name: "Nano Bond (Short - Women)", category: "Hair Treatments", price: 6500, duration_mins: 180 },
    { name: "Nano Bond (Medium - Women)", category: "Hair Treatments", price: 9000, duration_mins: 210 },
    { name: "Nano Bond (Long - Women)", category: "Hair Treatments", price: 12000, duration_mins: 240 },
    { name: "Bot Bond (Short - Women)", category: "Hair Treatments", price: 6000, duration_mins: 180 },
    { name: "Bot Bond (Medium - Women)", category: "Hair Treatments", price: 8500, duration_mins: 210 },
    { name: "Bot Bond (Long - Women)", category: "Hair Treatments", price: 10000, duration_mins: 240 },
    // Straightening/Smoothing
    { name: "Permanent Straight (Short - Women)", category: "Hair Treatments", price: 2000, duration_mins: 180 },
    { name: "Permanent Straight (Medium - Women)", category: "Hair Treatments", price: 4000, duration_mins: 210 },
    { name: "Permanent Straight (Long - Women)", category: "Hair Treatments", price: 6000, duration_mins: 240 },
    { name: "Smoothing (Short - Women)", category: "Hair Treatments", price: 2000, duration_mins: 180 },
    { name: "Smoothing (Medium - Women)", category: "Hair Treatments", price: 4000, duration_mins: 210 },
    { name: "Smoothing (Long - Women)", category: "Hair Treatments", price: 6000, duration_mins: 240 },

    // --- Head Massage (Women) ---
    { name: "Coconut Oil Massage (15 min - Women)", category: "Massage", price: 300, duration_mins: 15 },
    { name: "Coconut Oil Massage (30 min - Women)", category: "Massage", price: 450, duration_mins: 30 },
    { name: "Olive Oil Massage (15 min - Women)", category: "Massage", price: 350, duration_mins: 15 },
    { name: "Olive Oil Massage (30 min - Women)", category: "Massage", price: 500, duration_mins: 30 },

    // --- Hair Styling (Women) ---
    { name: "Temporary Straightening (Women)", category: "Hair Styling", price: 500, duration_mins: 45 },
    { name: "Temporary Curling (Women)", category: "Hair Styling", price: 700, duration_mins: 60 },

    // --- Hair Colour Services (Women) ---
    { name: "Balayage (Short - Women)", category: "Hair Color", price: 1499, duration_mins: 120 },
    { name: "Balayage (Medium - Women)", category: "Hair Color", price: 2999, duration_mins: 150 },
    { name: "Balayage (Long - Women)", category: "Hair Color", price: 3999, duration_mins: 180 },
    { name: "Global Hair: Belbetree (Women)", category: "Hair Color", price: 1500, duration_mins: 90 },
    { name: "Global Hair: Loreal (Women)", category: "Hair Color", price: 2000, duration_mins: 90 },
    { name: "Highlights Per Strip (Bleach)", category: "Hair Color", price: 300, duration_mins: 20 },
    { name: "Highlights Per Strip (Color)", category: "Hair Color", price: 500, duration_mins: 30 },

    // --- Makeup Services ---
    { name: "Party Makeup (Women)", category: "Makeup", price: 2000, duration_mins: 90 },
    { name: "Bridal Makeup: Normal", category: "Makeup", price: 7000, duration_mins: 180 },
    { name: "Bridal Makeup: Mix Match", category: "Makeup", price: 10000, duration_mins: 210 },
    { name: "HD Bridal Makeup", category: "Makeup", price: 15000, duration_mins: 240 },

    // --- Pre-Bridal Packages ---
    { name: "Pre-Bridal: Silver Package", category: "Packages", price: 10000, duration_mins: 360 },
    { name: "Pre-Bridal: Gold Package", category: "Packages", price: 15000, duration_mins: 480 },

    // ==========================================
    // ✨ MEN'S SALON MENU
    // ==========================================

    // --- Haircut & Grooming (Men) ---
    { name: "Haircut (Men)", category: "Men", price: 200, duration_mins: 30 },
    { name: "Beard Trim (Men)", category: "Men", price: 150, duration_mins: 20 },
    { name: "Shaving (Men)", category: "Men", price: 100, duration_mins: 20 },
    { name: "Haircut + Beard Combo (Men)", category: "Men", price: 300, duration_mins: 45 },

    // --- Hair Wash (Men) ---
    { name: "Normal Hair Wash (Men)", category: "Hair Care", price: 100, duration_mins: 10 },
    { name: "Streax Canvo Wash (Men)", category: "Hair Care", price: 200, duration_mins: 15 },
    { name: "Loreal Hair Wash (Men)", category: "Hair Care", price: 350, duration_mins: 15 },

    // --- Hair Spa (Men) ---
    { name: "Keratin Spa (Men)", category: "Hair Spa", price: 400, duration_mins: 45 },
    { name: "Loreal Spa (Men)", category: "Hair Spa", price: 600, duration_mins: 45 },
    { name: "Brazilian Spa (Men)", category: "Hair Spa", price: 800, duration_mins: 60 },
    { name: "Anti-Dandruff Spa (Men)", category: "Hair Spa", price: 600, duration_mins: 45 },
    { name: "Anti-Hairfall Spa (Men)", category: "Hair Spa", price: 800, duration_mins: 60 },

    // --- Facial & Cleanup (Men) ---
    { name: "VLCC Cleanup (Men)", category: "Facial", price: 250, duration_mins: 30 },
    { name: "VLCC Facial (Men)", category: "Facial", price: 450, duration_mins: 60 },
    { name: "Whitening Facial (Men)", category: "Facial", price: 600, duration_mins: 60 },
    { name: "O3 Facial (Men)", category: "Facial", price: 1200, duration_mins: 75 },

    // --- D-Tan & Bleach (Men) ---
    { name: "Aquaglow D-Tan (Men)", category: "Skincare", price: 300, duration_mins: 30 },
    { name: "Ragga D-Tan (Men)", category: "Skincare", price: 400, duration_mins: 30 },
    { name: "O3 D-Tan (Men)", category: "Skincare", price: 500, duration_mins: 30 },
    { name: "Power Mask (Men)", category: "Skincare", price: 700, duration_mins: 45 },

    // --- Manicure & Pedicure (Men) ---
    { name: "Manicure: Normal (Men)", category: "Mani/Pedi", price: 350, duration_mins: 45 },
    { name: "Pedicure: Normal (Men)", category: "Mani/Pedi", price: 550, duration_mins: 60 },
    { name: "Manicure: O3 (Men)", category: "Mani/Pedi", price: 800, duration_mins: 75 },
    { name: "Pedicure: O3 (Men)", category: "Mani/Pedi", price: 1800, duration_mins: 90 },

    // --- Massage (Men) ---
    { name: "Body Massage (30 min - Men)", category: "Massage", price: 1800, duration_mins: 30 },
    { name: "Body Massage (45 min - Men)", category: "Massage", price: 2200, duration_mins: 45 },
    { name: "Foot Massage (30 min - Men)", category: "Massage", price: 400, duration_mins: 30 },
    { name: "Back Massage (30 min - Men)", category: "Massage", price: 350, duration_mins: 30 },

    // --- Waxing (Men) ---
    { name: "Honey Wax: Under Arms (Men)", category: "Waxing", price: 100, duration_mins: 15 },
    { name: "Honey Wax: Chest (Men)", category: "Waxing", price: 250, duration_mins: 30 },
    { name: "Honey Wax: Back (Men)", category: "Waxing", price: 300, duration_mins: 30 },
    { name: "Rica Wax: Chest (Men)", category: "Waxing", price: 400, duration_mins: 30 },

    // --- Hair Treatments (Men) ---
    { name: "Permanent Straight (Short - Men)", category: "Hair Treatments", price: 1800, duration_mins: 120 },
    { name: "Keratin Treatment (Short - Men)", category: "Hair Treatments", price: 1500, duration_mins: 90 },
    
    // --- Hair Colour (Men) ---
    { name: "Global Hair: Belbetree (Men)", category: "Hair Color", price: 1500, duration_mins: 60 },
    { name: "Global Hair: Loreal (Men)", category: "Hair Color", price: 2000, duration_mins: 60 },
    { name: "Highlights Per Strip (Color - Men)", category: "Hair Color", price: 500, duration_mins: 30 },
  ];

  try {
    const { supabase } = await import('@/lib/supabase');
    
    // 1. Clear existing
    await supabase.from("services").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    // 2. Insert new in chunks
    const chunkSize = 50;
    for (let i = 0; i < allServices.length; i += chunkSize) {
      const chunk = allServices.slice(i, i + chunkSize);
      const { error } = await supabase.from("services").insert(chunk);
      if (error) throw error;
    }

    return { success: true, count: allServices.length };
  } catch (error) {
    console.error("Exception seeding services:", error);
    return { success: false, error: error.message || "An exception occurred" };
  }
}
