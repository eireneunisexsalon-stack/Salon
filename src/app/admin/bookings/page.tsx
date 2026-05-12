"use client";

import { useState, useEffect } from 'react';
import { getBookings, updateBookingStatus } from '../../actions/admin';
import { createBooking, getServicesForBooking } from '../../actions/book';

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Walk-in State
  const [services, setServices] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [serviceSearch, setServiceSearch] = useState('');
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  useEffect(() => {
    fetchBookings();
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const data = await getServicesForBooking();
    setServices(data || []);
  };

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

  const handleAddWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !serviceId || !date || !time) return;

    setIsSubmitting(true);
    
    const service = services.find(s => s.id === serviceId);
    
    const result = await createBooking({
      customer_name: name,
      phone_number: phone,
      service_name: service?.name || 'Walk-in Service',
      booking_date: date,
      time_slot: time,
      deposit_amount: service?.price || 0, // Full amount for offline
      total_amount: service?.price || 0,
      status: 'confirmed',
    });

    if (result.success) {
      alert("Walk-in booking added successfully!");
      setName('');
      setPhone('');
      setServiceId('');
      setServiceSearch('');
      setDate('');
      setTime('');
      await fetchBookings();
    } else {
      alert("Failed to add walk-in: " + (result.error || ""));
    }
    
    setIsSubmitting(false);
  };

  const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gold">Manage Bookings</h1>

      {/* Add Walk-in Form */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-xl mb-12">
        <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Add Walk-in Client</h2>
        <form onSubmit={handleAddWalkIn} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Customer Name</label>
            <input 
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul" 
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Phone</label>
            <input 
              type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210" 
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold text-sm"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-1 text-gray-400">Service</label>
            <input 
              type="text" 
              value={serviceSearch}
              onChange={(e) => {
                setServiceSearch(e.target.value);
                setServiceId(''); // Reset ID if they type something new
                setShowServiceDropdown(true);
              }}
              onFocus={() => setShowServiceDropdown(true)}
              onBlur={() => setTimeout(() => setShowServiceDropdown(false), 200)}
              placeholder="Search services..."
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold text-sm"
              required={!serviceId}
            />
            {showServiceDropdown && (
              <div className="absolute top-full left-0 w-full mt-1 max-h-48 overflow-y-auto bg-[#0a0a0a] border border-white/20 rounded-md z-50 shadow-2xl scrollbar-thin">
                {services.filter(s => s.name.toLowerCase().includes(serviceSearch.toLowerCase())).map(s => (
                  <div 
                    key={s.id} 
                    className="p-3 hover:bg-white/10 cursor-pointer text-sm text-gray-300 hover:text-white transition-colors border-b border-white/5 last:border-0"
                    onClick={() => {
                      setServiceId(s.id);
                      setServiceSearch(`${s.name} - ₹${s.price}`);
                      setShowServiceDropdown(false);
                    }}
                  >
                    {s.name} <span className="text-gold text-xs float-right font-bold mt-0.5">₹{s.price}</span>
                  </div>
                ))}
                {services.filter(s => s.name.toLowerCase().includes(serviceSearch.toLowerCase())).length === 0 && (
                  <div className="p-3 text-sm text-gray-500 italic text-center">No services found</div>
                )}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Date</label>
            <input 
              type="date" required value={date} onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={{ colorScheme: 'dark' }}
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Time</label>
            <select 
              required value={time} onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold text-sm"
            >
              <option value="" disabled>Select Time</option>
              {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <button 
              type="submit" disabled={isSubmitting}
              className="w-full py-2 bg-gold text-black font-bold rounded-md uppercase tracking-wider text-xs disabled:opacity-50 h-[38px]"
            >
              {isSubmitting ? "Adding..." : "Add Client"}
            </button>
          </div>
        </form>
      </div>

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
                      <option value="pending" className="bg-black text-white">Pending</option>
                      <option value="confirmed" className="bg-black text-white">Confirm</option>
                      <option value="completed" className="bg-black text-white">Complete</option>
                      <option value="cancelled" className="bg-black text-white">Cancel</option>
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
