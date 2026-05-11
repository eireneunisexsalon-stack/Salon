import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const servicesToSeed = [
  // HAIR STYLING & GROOMING - Men
  { name: "Hair Cut", category: "Men", price: 200, duration_mins: 30 },
  { name: "Beard", category: "Men", price: 150, duration_mins: 20 },
  { name: "Shaving", category: "Men", price: 100, duration_mins: 20 },
  
  // HAIR STYLING & GROOMING - Women
  { name: "Normal Cut", category: "Women", price: 350, duration_mins: 45 },
  { name: "U Cut", category: "Women", price: 350, duration_mins: 45 },
  { name: "V Cut", category: "Women", price: 350, duration_mins: 45 },
  { name: "Straight Cut", category: "Women", price: 350, duration_mins: 45 },
  { name: "Advance Hair Cut", category: "Women", price: 500, duration_mins: 60 },
  
  // Hair Wash
  { name: "Hair Wash (Normal)", category: "Women", price: 150, duration_mins: 15 },
  { name: "StreaX canvo Wash", category: "Women", price: 300, duration_mins: 20 },
  { name: "Loreal Wash", category: "Women", price: 500, duration_mins: 20 },
  
  // Treatments
  { name: "Temporary Straightening", category: "Women", price: 500, duration_mins: 45 },
  { name: "Temporary Curl", category: "Women", price: 700, duration_mins: 60 },
  { name: "Keratin Treatment", category: "Women", price: 1500, duration_mins: 120 },
  { name: "Botox Treatment", category: "Women", price: 4500, duration_mins: 150 },
  { name: "Smoothning", category: "Women", price: 2000, duration_mins: 180 },
  
  // Hair Spa
  { name: "Keratin Spa", category: "Women", price: 500, duration_mins: 60 },
  { name: "Anti Dandruff Spa", category: "Women", price: 800, duration_mins: 60 },
  { name: "Anti Hairfall Spa", category: "Women", price: 1000, duration_mins: 60 },
  
  // Face & Skincare
  { name: "Threading", category: "Women", price: 40, duration_mins: 10 },
  { name: "Upper Lips", category: "Women", price: 20, duration_mins: 5 },
  { name: "VLCC Facial", category: "Women", price: 500, duration_mins: 60 },
  { name: "Whitening Facial", category: "Women", price: 700, duration_mins: 60 },
  { name: "Lotus Gold Facial", category: "Women", price: 900, duration_mins: 60 },
  { name: "O3 Facial", category: "Women", price: 1500, duration_mins: 75 },
  { name: "D-Tan Ragga", category: "Women", price: 450, duration_mins: 30 },
  
  // Waxing
  { name: "Under Arms Wax", category: "Women", price: 70, duration_mins: 15 },
  { name: "Hand Wax", category: "Women", price: 150, duration_mins: 30 },
  { name: "Full Legs Wax", category: "Women", price: 300, duration_mins: 45 },
  { name: "Full Body Wax", category: "Women", price: 800, duration_mins: 90 },
  
  // Spa & Wellness
  { name: "Foot Massage", category: "Women", price: 500, duration_mins: 30 },
  { name: "Body Massage", category: "Women", price: 2000, duration_mins: 45 },
  { name: "Head Massage (Coconut)", category: "Women", price: 300, duration_mins: 20 },
  { name: "Normal Mani/Pedi", category: "Women", price: 650, duration_mins: 60 },
  
  // Makeup
  { name: "Party Makeup", category: "Women", price: 2000, duration_mins: 90 },
  { name: "Bridal Makeup", category: "Women", price: 7000, duration_mins: 180 },
  { name: "HD Makeup", category: "Women", price: 15000, duration_mins: 180 },
];

async function seed() {
  console.log('Seeding all services...');
  
  try {
    // 1. Delete existing
    const { error: deleteError } = await supabase
      .from('services')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) throw deleteError;
    console.log('Cleared existing services.');

    // 2. Insert new
    const { error: insertError } = await supabase
      .from('services')
      .insert(servicesToSeed);
    
    if (insertError) throw insertError;
    console.log(`Successfully seeded ${servicesToSeed.length} services!`);
    
  } catch (error) {
    console.error('Error during seeding:', error.message);
  } finally {
    process.exit();
  }
}

seed();
