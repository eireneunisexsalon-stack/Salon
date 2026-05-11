import { getUserBookings, getUser } from '../actions/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function MyBookingsPage() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  const bookings = await getUserBookings();

  return (
    <div className="min-h-screen text-white relative z-10">
      <header className="w-full py-6 px-8 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="text-xl md:text-2xl font-black tracking-[0.1em] italic">
          EIRENE<span className="text-gold">SALON</span>
        </Link>
        <Link href="/" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-gold transition-colors">Back to Home</Link>
      </header>

      <main className="max-w-4xl mx-auto py-16 px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-black uppercase italic tracking-tight mb-2">My <span className="text-gold">Appointments</span></h1>
          <p className="text-gray-500 text-xs tracking-widest uppercase">Track your grooming journey</p>
        </div>

        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="bg-[#0a0a0a] border border-dashed border-white/10 p-20 rounded-3xl text-center">
              <p className="text-gray-500 text-sm tracking-widest uppercase mb-8">No bookings found yet.</p>
              <Link href="/book" className="px-8 py-4 bg-gold text-black font-black rounded-xl uppercase tracking-widest text-[10px]">Book Your First Chair</Link>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-3xl hover:border-gold/30 transition-all group">
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
                          Your 10% payment is being verified by the owner. You will see "Confirmed" once it's processed.
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

      <footer className="py-12 text-center text-gray-600 text-[10px] tracking-widest uppercase border-t border-white/5">
        &copy; {new Date().getFullYear()} Unisex Salon. All Rights Reserved.
      </footer>
    </div>
  );
}
