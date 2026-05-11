"use client";

import { useEffect, useState } from 'react';
import { getBookings, updateBookingStatus, verifyPaymentManually } from '../actions/admin';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setIsLoading(true);
    const data = await getBookings();
    setBookings(data);
    setIsLoading(false);
  }

  async function handleStatusChange(id: string, status: string) {
    const success = await updateBookingStatus(id, status);
    if (success) fetchBookings();
  }

  async function handleVerify(id: string) {
    const result = await verifyPaymentManually(id);
    if (result.success) {
      alert("Payment verified and credited to wallet!");
      fetchBookings();
    } else {
      alert("Verification failed: " + result.error);
    }
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending_verification').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight italic">
            Admin <span className="text-gold">Dashboard</span>
          </h1>
          <p className="text-gray-500 text-xs tracking-widest uppercase">Manage appointments & verify payments</p>
        </div>
        <button 
          onClick={fetchBookings}
          className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
        >
          <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Bookings</p>
          <p className="text-3xl font-black text-white italic">{stats.total}</p>
        </div>
        <div className="bg-gold/10 border border-gold/30 p-6 rounded-2xl">
          <p className="text-[10px] text-gold uppercase tracking-widest mb-1">Pending Verification</p>
          <p className="text-3xl font-black text-gold italic">{stats.pending}</p>
        </div>
        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Confirmed</p>
          <p className="text-3xl font-black text-white italic">{stats.confirmed}</p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-gray-500">
                <th className="p-6 text-[10px] uppercase tracking-widest font-black">Customer</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-black">Service</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-black">Schedule</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-black">Payment (10%)</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-black">Status</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={6} className="p-20 text-center text-gold animate-pulse font-black uppercase tracking-widest">Loading...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={6} className="p-20 text-center text-gray-600">No bookings found.</td></tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <p className="text-white font-bold">{booking.customer_name}</p>
                      <p className="text-[10px] text-gray-500">{booking.phone_number}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-white font-bold">{booking.service_name}</p>
                      <p className="text-[10px] text-gold uppercase tracking-tighter italic">₹{booking.total_amount}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-white font-bold">{booking.booking_date}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{booking.time_slot}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-white font-black italic">₹{booking.deposit_amount}</p>
                      <span className={`text-[8px] uppercase font-black tracking-widest ${booking.payment_status === 'paid' ? 'text-green-500' : 'text-orange-500'}`}>
                        {booking.payment_status === 'paid' ? '✓ Received' : '⌛ Awaiting'}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        booking.status === 'pending_verification' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        'bg-white/5 text-gray-400 border-white/10'
                      }`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-6 text-right space-x-2 whitespace-nowrap">
                      {booking.status === 'pending_verification' && (
                        <button 
                          onClick={() => handleVerify(booking.id)}
                          className="px-4 py-2 bg-gold text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                        >
                          Verify Payment
                        </button>
                      )}
                      <select 
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className="bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-lg p-2 outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="pending_verification">Verifying</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
