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
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
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
    if (!name || !phone || selectedServices.length === 0 || !date || !time) return;

    setIsSubmitting(true);
    
    const result = await createBooking({
      customer_name: name,
      phone_number: phone,
      service_name: selectedServices.map(s => s.name).join(", "),
      booking_date: date,
      time_slot: time,
      deposit_amount: parseInt(amount) || 0,
      total_amount: parseInt(amount) || 0,
      status: 'confirmed',
      payment_method: paymentMethod,
      is_walkin: true,
      notes: notes
    });

    if (result.success) {
      alert("Walk-in booking added successfully!");
      setName('');
      setPhone('');
      setSelectedServices([]);
      setServiceSearch('');
      setDate(new Date().toISOString().split('T')[0]);
      setTime('');
      setAmount('');
      setNotes('');
      setPaymentMethod('Cash');
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
        <form onSubmit={handleAddWalkIn} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Customer Name</label>
            <input 
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul" 
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Phone Number</label>
            <input 
              type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210" 
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold text-sm"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-1 text-gray-400">Select Service</label>
            <input 
              type="text" 
              value={serviceSearch}
              onChange={(e) => {
                setServiceSearch(e.target.value);
                setShowServiceDropdown(true);
              }}
              onFocus={() => setShowServiceDropdown(true)}
              onClick={() => setShowServiceDropdown(true)}
              onBlur={() => setTimeout(() => setShowServiceDropdown(false), 200)}
              placeholder="Search services..."
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold text-sm"
              required={selectedServices.length === 0}
            />
            {showServiceDropdown && (
              <div className="absolute top-full left-0 w-full mt-1 max-h-48 overflow-y-auto bg-[#0a0a0a] border border-white/20 rounded-md z-50 shadow-2xl scrollbar-thin">
                {services.filter(s => s.name.toLowerCase().includes(serviceSearch.toLowerCase())).map(s => {
                  const isSelected = selectedServices.some(item => item.id === s.id);
                  return (
                    <div 
                      key={s.id} 
                      className={`p-3 cursor-pointer text-sm transition-colors border-b border-white/5 last:border-0 flex justify-between items-center ${
                        isSelected 
                          ? 'bg-gold/10 text-gold hover:bg-gold/20' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        let newServices;
                        if (isSelected) {
                          newServices = selectedServices.filter(item => item.id !== s.id);
                        } else {
                          newServices = [...selectedServices, s];
                        }
                        setSelectedServices(newServices);
                        setAmount(newServices.reduce((sum, item) => sum + item.price, 0).toString());
                        setServiceSearch('');
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected && <span className="text-gold font-bold">✓</span>}
                        <span>{s.name}</span>
                      </div>
                      <span className="text-gold text-xs font-bold">₹{s.price}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {selectedServices.length > 0 && (
            <div className="lg:col-span-4 bg-white/5 p-4 rounded-lg border border-white/10 mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Selected Services</p>
                <button type="button" onClick={() => { setSelectedServices([]); setAmount('0'); }} className="text-[9px] text-red-500 hover:text-red-400 uppercase tracking-widest font-bold">Clear All</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedServices.map(s => (
                  <span key={s.id} className="flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-[10px] font-bold text-gold">
                    {s.name} (₹{s.price})
                    <button type="button" onClick={() => {
                      const newServices = selectedServices.filter(item => item.id !== s.id);
                      setSelectedServices(newServices);
                      setAmount(newServices.reduce((sum, item) => sum + item.price, 0).toString());
                    }} className="hover:text-white">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Total Amount (₹)</label>
            <input 
              type="number" required value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="Price" 
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold text-sm"
            />
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
            <label className="block text-sm font-medium mb-1 text-gray-400">Time Slot</label>
            <select 
              required value={time} onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold text-sm"
            >
              <option value="" disabled>Select Time</option>
              {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Payment Mode</label>
            <select 
              value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold text-sm"
            >
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
            </select>
          </div>
          <div>
            <button 
              type="submit" disabled={isSubmitting}
              className="w-full py-2 bg-gold text-black font-bold rounded-md uppercase tracking-wider text-xs disabled:opacity-50 h-[38px] shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:bg-white transition-all"
            >
              {isSubmitting ? "Adding..." : "Add Walk-in Client"}
            </button>
          </div>
          <div className="lg:col-span-4">
            <label className="block text-sm font-medium mb-1 text-gray-400">Special Notes / Remarks</label>
            <input 
              type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra long hair, requested specific stylist, etc." 
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold text-sm"
            />
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
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400">Service & Payment</th>
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
                  <td className="p-4">
                    <div className="font-bold">{booking.service_name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                        booking.payment_method === 'Cash' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }`}>
                        {booking.payment_method || 'Online'}
                      </span>
                      {booking.is_walkin && (
                        <span className="px-2 py-0.5 bg-gold/10 text-gold border border-gold/20 rounded text-[10px] font-bold uppercase tracking-widest">
                          Walk-in
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      ${booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 
                        booking.status === 'confirmed' ? 'bg-green-500/20 text-green-500' : 
                        booking.status === 'completed' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-gray-500/20 text-gray-400'}`}
                    >
                      {booking.status}
                    </span>
                    {booking.notes && <p className="text-[10px] text-gray-500 mt-2 italic max-w-[200px] truncate" title={booking.notes}>{booking.notes}</p>}
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
