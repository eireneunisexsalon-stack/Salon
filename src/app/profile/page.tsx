"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import SignOutButton from './SignOutButton';
import AmbientParticles from '../components/AmbientParticles';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);

      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", session.user.id)
        .order("booking_date", { ascending: false });
        
      setBookings(data || []);
      setLoading(false);
    }
    
    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  const fullName = user?.user_metadata?.full_name || "Valued Customer";
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#020202] text-white relative overflow-hidden">
      {/* Global Fixed Background for Immersion */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
        <Image 
          src="/eirene-brand.png" 
          alt="Background Texture" 
          fill 
          className="object-cover animate-ken-burns contrast-125 saturate-150"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020202]/90 via-[#020202]/50 to-[#020202]/95"></div>
      </div>
      
      <AmbientParticles />

      <div className="relative z-10">
      <header className="w-full py-6 px-8 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="text-xl md:text-2xl font-black tracking-[0.1em] italic">
          EIRENE<span className="text-gold">SALON</span>
        </Link>
        <Link href="/" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-gold transition-colors">Back to Home</Link>
      </header>

      <main className="max-w-4xl mx-auto py-16 px-4">
        {/* Profile Header Card */}
        <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[2rem] mb-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="w-24 h-24 rounded-full bg-gold flex items-center justify-center text-black text-3xl font-black tracking-tighter shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              {initials}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black tracking-tight mb-2">{fullName}</h1>
              <p className="text-gray-400 text-sm tracking-widest uppercase mb-4">{user.email}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Total Bookings</p>
                  <p className="text-lg font-bold text-gold">{bookings.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <SignOutButton />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-black uppercase italic tracking-tight">Booking <span className="text-gold">History</span></h2>
        </div>

        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="bg-[#0a0a0a] border border-dashed border-white/10 p-20 rounded-3xl text-center">
              <p className="text-gray-500 text-sm tracking-widest uppercase mb-8">No bookings found yet.</p>
              <Link href="/book" className="px-8 py-4 bg-gold text-black font-black rounded-xl uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]">Book Your First Chair</Link>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-3xl hover:border-gold/30 transition-all group shadow-lg">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                        booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        booking.status === 'pending_verification' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        'bg-white/5 text-gray-500 border-white/10'
                      }`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-gray-600 uppercase tracking-widest">ID: {booking.id.slice(0, 8)}</span>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors">{booking.service_name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{booking.booking_date} at {booking.time_slot}</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end justify-between gap-4">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Amount</p>
                      <p className="text-2xl font-black italic text-white">₹{booking.total_amount}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Paid (Advance)</p>
                      <p className="text-lg font-black italic text-gold">₹{booking.deposit_amount}</p>
                    </div>
                  </div>
                </div>

                {booking.status === 'pending_verification' && (
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <div className="flex items-start gap-3 bg-gold/5 p-4 rounded-xl border border-gold/10">
                      <svg className="w-5 h-5 text-gold mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-[10px] text-gold font-black uppercase tracking-widest mb-1">Waiting for Owner</p>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          Your payment receipt is being verified by the owner. You will see "Confirmed" once it's processed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      <footer className="py-12 text-center text-gray-600 text-[10px] tracking-widest uppercase border-t border-white/5 mt-20">
        &copy; {new Date().getFullYear()} Eirene Salon. All Rights Reserved.
      </footer>
      </div>
    </div>
  );
}
