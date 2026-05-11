"use client";

import { useState, useEffect } from 'react';
import { getBookings, updateBookingStatus } from '../../actions/admin';

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const data = await getBookings();
    setBookings(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Optimistic UI update
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    
    // Server update
    await updateBookingStatus(id, newStatus);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gold">Manage Bookings</h1>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading bookings...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400">Date & Time</th>
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400">Customer Details</th>
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400">Service</th>
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400">Status</th>
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking: any) => (
                <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="font-bold">{booking.booking_date}</div>
                    <div className="text-gold text-sm">{booking.time_slot}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold">{booking.customer_name}</div>
                    <div className="text-gray-400 text-sm">{booking.phone_number}</div>
                  </td>
                  <td className="p-4">{booking.service_name}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      ${booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 
                        booking.status === 'confirmed' ? 'bg-green-500/20 text-green-500' : 
                        booking.status === 'completed' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-gray-500/20 text-gray-400'}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select 
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className="bg-black border border-white/20 text-white text-sm rounded px-3 py-1.5 focus:border-gold outline-none cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirm</option>
                      <option value="completed">Complete</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No bookings found in database.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
