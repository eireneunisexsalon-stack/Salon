'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { useSearchParams, useRouter } from 'next/navigation';
import { createBooking, getBookedSlots, getServicesForBooking } from '../actions/book';
import { getActiveOffer } from '../actions/offers';
import { getUser } from '../actions/auth';
import { supabase } from '@/lib/supabase';

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedServiceName = searchParams.get('service');

  const [step, setStep] = useState(1);
  const [services, setServices] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('Men');
  
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [activeOffer, setActiveOffer] = useState<any>(null);

  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isCheckingSlots, setIsCheckingSlots] = useState(false);

  const timeSlots = {
    Morning: ["10:00 AM", "11:00 AM", "12:00 PM"],
    Afternoon: ["01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"],
    Evening: ["05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"]
  };

  useEffect(() => {
    async function loadServices() {
      const [data, offer] = await Promise.all([
        getServicesForBooking(),
        getActiveOffer()
      ]);
      setServices(data);
      setActiveOffer(offer);
      
      // Handle preselected service from query param
      if (preselectedServiceName && data.length > 0) {
        const matched = data.find(s => s.name.toLowerCase() === preselectedServiceName.toLowerCase());
        if (matched) {
          setSelectedService(matched);
          setActiveCategory(matched.category);
        }
      }
      
      setLoadingServices(false);
    }
    loadServices();
  }, [preselectedServiceName]);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login?redirectTo=/book');
      } else if (session.user?.user_metadata?.full_name) {
        setName(session.user.user_metadata.full_name);
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (selectedDate && activeCategory) {
      setIsCheckingSlots(true);
      getBookedSlots(selectedDate, activeCategory).then(slots => {
        setBookedSlots(slots);
        setIsCheckingSlots(false);
        if (slots.includes(selectedTime)) {
          setSelectedTime("");
        }
      });
    }
  }, [selectedDate, selectedTime, activeCategory]);

  const filteredServices = services.filter(s => s.category === activeCategory);

  const handleBookingSubmit = async () => {
    if (!name || !phone || !selectedService || !selectedDate || !selectedTime || !receiptFile) {
      setError("Please fill in all details and upload your payment receipt.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Upload Receipt to Supabase Storage
    let receiptUrl = null;
    const fileExt = receiptFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('payment_receipts')
      .upload(fileName, receiptFile);

    if (uploadError) {
      setIsLoading(false);
      setError("Failed to upload receipt: " + uploadError.message);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('payment_receipts')
      .getPublicUrl(fileName);
      
    receiptUrl = publicUrlData.publicUrl;

    const finalPrice = activeOffer ? Math.round(selectedService.price * (1 - activeOffer.discount_percentage / 100)) : selectedService.price;
    const depositAmount = Math.round(finalPrice * 0.1);

    const { data: { session } } = await supabase.auth.getSession();

    // Create the booking with 'pending_verification' status
    const result = await createBooking({
      customer_name: name,
      phone_number: phone,
      service_name: selectedService.name,
      booking_date: selectedDate,
      time_slot: selectedTime,
      deposit_amount: depositAmount,
      total_amount: finalPrice,
      status: 'pending_verification',
      user_id: session?.user?.id,
      receipt_url: receiptUrl
    });

    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "An error occurred");
    }
  };

  const steps = ["Service", "Schedule", "Payment"];

  if (success) {
    return (
      <div className="flex flex-col min-h-screen text-white">
        <header className="w-full py-6 px-8 flex justify-between items-center border-b border-white/5 bg-black/60 backdrop-blur-xl fixed z-50">
          <Link href="/" className="text-xl md:text-2xl font-black tracking-[0.1em] italic">
            EIRENE<span className="text-gold">SALON</span>
          </Link>
        </header>
        <main className="flex-1 flex flex-col justify-center items-center px-4 pt-24">
          <div className="w-full max-w-lg border border-gold/30 p-12 rounded-3xl bg-gold/5 backdrop-blur-2xl text-center shadow-[0_0_50px_rgba(212,175,55,0.1)]">
            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold/30">
              <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Request Submitted!</h2>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              Your booking for <span className="text-white font-bold">{selectedService?.name}</span> is now <span className="text-gold font-bold">Pending Verification</span>. The owner will confirm your appointment once the 10% payment is verified.
            </p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-8 text-left">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Customer Name</p>
              <p className="text-white font-bold mb-3">{name}</p>
              <div className="flex justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-white font-bold">{selectedDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Time</p>
                  <p className="text-white font-bold">{selectedTime}</p>
                </div>
              </div>
            </div>
            <Link href="/" className="inline-block px-10 py-4 bg-gold text-black uppercase tracking-widest text-[10px] font-black rounded-xl hover:bg-white transition-all">
              Return Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white">
      <header className="w-full py-6 px-8 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-md fixed z-50">
        <Link href="/" className="text-xl md:text-2xl font-black tracking-[0.1em] italic">
          EIRENE<span className="text-gold">SALON</span>
        </Link>
        <div className="hidden md:flex items-center gap-4">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step > i + 1 ? 'bg-gold text-black' : step === i + 1 ? 'border-2 border-gold text-gold' : 'border border-white/20 text-gray-500'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`ml-2 text-xs uppercase tracking-widest font-semibold ${step === i + 1 ? 'text-white' : 'text-gray-500'}`}>{s}</span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-white/10 mx-4"></div>}
            </div>
          ))}
        </div>
      </header>

      <main className="flex-1 py-32 px-4 flex justify-center items-start">
        <div className="w-full max-w-2xl">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 uppercase italic">Book Your <span className="text-gold">Experience</span></h1>
            <p className="text-gray-400 font-light tracking-[0.2em] text-[10px] uppercase">Premium grooming &bull; Handcrafted styles</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 text-xs text-center backdrop-blur-sm uppercase tracking-widest">
              {error}
            </div>
          )}

          <div className="bg-[#0a0a0a] border border-white/10 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex p-1 bg-white/5 rounded-full w-max mx-auto mb-8 border border-white/10">
                  {['Men', 'Women'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-8 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all ${activeCategory === cat ? 'bg-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {loadingServices ? (
                  <div className="py-20 flex justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold"></div>
                  </div>
                ) : filteredServices.length === 0 ? (
                  <div className="py-12 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
                    No {activeCategory.toLowerCase()} services found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredServices.map(s => (
                      <button 
                        key={s.id} 
                        onClick={() => setSelectedService(s)}
                        className={`p-6 rounded-2xl border text-left transition-all group ${selectedService?.id === s.id ? 'border-gold bg-gold/5 ring-1 ring-gold/20' : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className={`font-bold tracking-wide transition-colors ${selectedService?.id === s.id ? 'text-gold' : 'text-white'}`}>{s.name}</h3>
                          {activeOffer ? (
                            <div className="text-right">
                              <span className="text-[10px] text-gray-500 line-through block">₹{s.price}</span>
                              <span className="text-green-400 font-bold">₹{Math.round(s.price * (1 - activeOffer.discount_percentage / 100))}</span>
                            </div>
                          ) : (
                            <span className="text-gold font-bold">₹{s.price}</span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{s.duration_mins || '60'} MIN</p>
                      </button>
                    ))}
                  </div>
                )}

                <button 
                  disabled={!selectedService}
                  onClick={() => setStep(2)}
                  className="w-full py-5 bg-gold text-black font-black rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] mt-8"
                >
                  Pick Schedule
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <label className="block text-[10px] uppercase tracking-[0.3em] font-black mb-4 text-gold">1. Select Date</label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-4 bg-black border border-white/10 rounded-xl text-white outline-none focus:border-gold transition-all"
                    style={{ colorScheme: 'dark' }}
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                  />
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <label className="block text-[10px] uppercase tracking-[0.3em] font-black text-gold">2. Choose Time</label>
                    {isCheckingSlots && selectedDate && <span className="text-[9px] text-gold animate-pulse tracking-[0.2em] font-black">CHECKING...</span>}
                  </div>
                  
                  {!selectedDate ? (
                    <div className="py-8 text-center text-gray-500 text-[10px] uppercase tracking-widest italic">Pick a date first.</div>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(timeSlots).map(([period, slots]) => (
                        <div key={period}>
                          <h4 className="text-[9px] uppercase tracking-widest text-gray-600 mb-3 font-black">{period}</h4>
                          <div className="grid grid-cols-3 gap-3">
                            {slots.map(t => {
                              const isBooked = bookedSlots.includes(t);
                              return (
                                <button 
                                  key={t}
                                  disabled={isBooked || isCheckingSlots}
                                  onClick={() => setSelectedTime(t)}
                                  className={`py-3 rounded-xl text-[10px] border transition-all flex flex-col items-center justify-center uppercase tracking-widest font-bold
                                    ${isBooked ? 'border-red-500/10 bg-red-500/5 text-red-500/40 cursor-not-allowed' : 
                                      selectedTime === t ? 'border-gold bg-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 
                                      'border-white/5 bg-white/[0.02] hover:border-gold/50'}`}
                                >
                                  {t}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-5 border border-white/10 text-white rounded-2xl hover:bg-white/5 uppercase tracking-[0.2em] text-[10px] font-black transition-all">Back</button>
                  <button 
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setStep(3)}
                    className="flex-[2] py-5 bg-gold text-black font-black rounded-2xl disabled:opacity-50 uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                  {(() => {
                    const finalPrice = activeOffer ? Math.round(selectedService.price * (1 - activeOffer.discount_percentage / 100)) : selectedService.price;
                    const advancePrice = Math.round(finalPrice * 0.1);
                    return (
                      <>
                        <h3 className="text-xl font-black text-white uppercase italic mb-2">Scan & Pay <span className="text-gold">₹{advancePrice}</span></h3>
                        <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase mb-8">Pay 10% advance to confirm your appointment</p>
                        
                        <div className="w-72 max-w-full mx-auto mb-8 bg-white p-3 rounded-2xl shadow-[0_0_40px_rgba(212,175,55,0.2)] flex justify-center items-center">
                          <img src="/qr-code.jpeg" alt="Payment QR Code" className="w-full h-auto object-contain rounded-lg" />
                        </div>

                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 space-y-4">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Total Service Price</span>
                            {activeOffer ? (
                              <div className="text-right">
                                <span className="text-gray-500 line-through text-[10px] mr-2">₹{selectedService.price}</span>
                                <span className="text-white font-bold">₹{finalPrice}</span>
                              </div>
                            ) : (
                              <span className="text-white font-bold">₹{finalPrice}</span>
                            )}
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gold font-bold italic">Advance to Pay Now</span>
                            <span className="text-gold font-black text-lg italic">₹{advancePrice}</span>
                          </div>
                          <div className="h-px bg-white/5"></div>
                          <p className="text-[9px] text-gray-600 uppercase tracking-widest text-center">
                            Remaining ₹{finalPrice - advancePrice} will be paid at salon
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-4 bg-black border border-white/10 rounded-xl text-white outline-none focus:border-gold transition-all text-sm" 
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-4 bg-black border border-white/10 rounded-xl text-white outline-none focus:border-gold transition-all text-sm" 
                  />
                  <div className="pt-2">
                    <label className="block text-[10px] uppercase tracking-widest font-black text-gold mb-2">Upload Payment Screenshot</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          setReceiptFile(e.target.files[0]);
                        }
                      }}
                      className="w-full p-3 bg-black border border-white/10 rounded-xl text-white outline-none focus:border-gold transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gold file:text-black hover:file:bg-white" 
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="flex-1 py-5 border border-white/10 text-white rounded-2xl hover:bg-white/5 uppercase tracking-[0.2em] text-[10px] font-black transition-all">Back</button>
                  <button 
                    onClick={handleBookingSubmit}
                    disabled={isLoading || !name || !phone || !receiptFile}
                    className="flex-[2] py-5 bg-gold text-black font-black rounded-2xl flex justify-center items-center disabled:opacity-50 uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                  >
                    {isLoading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : "I Have Paid & Confirm"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="py-8 text-center text-gray-600 text-xs tracking-widest uppercase border-t border-white/5">
        &copy; {new Date().getFullYear()} Eirene Salon. Premium Grooming Excellence.
      </footer>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    }>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <BookingForm />
    </Suspense>
  );
}
