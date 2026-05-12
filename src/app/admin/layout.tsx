'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [newBookingAlert, setNewBookingAlert] = useState<any>(null);
  const router = useRouter();

  // Play Notification Sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 1.0;
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Audio autoplay prevented by browser. Click anywhere on the page to allow sound.', error);
        });
      }
    } catch (e) {
      console.log('Audio notification failed', e);
    }
  };

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user || user.email?.toLowerCase() !== 'eireneunisexsalon@gmail.com') {
        router.push('/login');
      } else {
        setAuthorized(true);
      }
    }
    checkAdmin();

    // Set up Realtime listener for new bookings
    const channel = supabase
      .channel('public:bookings')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, payload => {
        playNotificationSound();
        setNewBookingAlert(payload.new);
        // Auto-dismiss after 8 seconds
        setTimeout(() => setNewBookingAlert(null), 8000);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
          <Link href="/admin/offers" className="block px-4 py-3 rounded-md hover:bg-white/5 text-gold hover:bg-gold/10 transition-colors font-bold">
            Offers & Promotions
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

      {/* Real-time Toast Notification */}
      {newBookingAlert && (
        <div className="fixed bottom-8 right-8 bg-[#0a0a0a] border border-gold/50 shadow-[0_0_40px_rgba(212,175,55,0.2)] p-6 rounded-2xl z-50 animate-in slide-in-from-bottom-5 duration-500">
          <div className="flex items-center gap-5">
            <div className="relative w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center border border-gold/30">
              <span className="text-xl">🔔</span>
              <div className="absolute inset-0 rounded-full border-2 border-gold animate-ping opacity-50"></div>
            </div>
            <div>
              <p className="text-gold font-black uppercase tracking-widest text-[10px] mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Live Booking Alert
              </p>
              <p className="font-bold text-white text-lg">{newBookingAlert.customer_name}</p>
              <p className="text-gray-400 text-sm mt-1">{newBookingAlert.service_name} • {newBookingAlert.time_slot}</p>
            </div>
            <button 
              onClick={() => setNewBookingAlert(null)} 
              className="ml-6 text-gray-500 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
