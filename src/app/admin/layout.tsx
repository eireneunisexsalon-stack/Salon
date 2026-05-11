'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user || user.email?.toLowerCase() !== 'eireneunisexsalon@gmail.com') {
        alert("Detected User: " + (user?.email || "No User Logged In"));
        router.push('/login');
      } else {
        setAuthorized(true);
      }
    }
    checkAdmin();
  }, [router]);

  if (!authorized) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#020202] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0a0a0a] flex flex-col">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-xl font-black tracking-[0.2em] text-white italic">
            EIRENE<span className="text-gold">ADMIN</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-3 rounded-md hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/bookings" className="block px-4 py-3 rounded-md hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
            Bookings
          </Link>
          <Link href="/admin/wallet" className="block px-4 py-3 rounded-md hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
            Wallet & Payments
          </Link>
          <Link href="/admin/services" className="block px-4 py-3 rounded-md hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
            Services
          </Link>
          <Link href="/admin/inventory" className="block px-4 py-3 rounded-md hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
            Product Inventory
          </Link>
          <Link href="/admin/staff" className="block px-4 py-3 rounded-md hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
            Staff Directory
          </Link>
          <Link href="/admin/gallery" className="block px-4 py-3 rounded-md hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
            Gallery Management
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10 mt-auto">
          <Link href="/" className="block text-center px-4 py-3 border border-white/20 text-white font-bold rounded-md hover:bg-white/10 hover:border-gold text-sm uppercase tracking-wider transition-all">
            View Live Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#050505]">
        {children}
      </main>
    </div>
  );
}
