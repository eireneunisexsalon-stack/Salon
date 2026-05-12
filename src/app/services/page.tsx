'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { getActiveOffer } from '@/app/actions/offers';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGender, setActiveGender] = useState<'Women' | 'Men'>('Women');
  const [activeOffer, setActiveOffer] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const offer = await getActiveOffer();
      setActiveOffer(offer);

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('price', { ascending: true });
      
      if (!error && data) {
        setServices(data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Organize services by gender and category
  const filteredMenu = useMemo(() => {
    const genderMenu = services.filter(s => {
      if (activeGender === 'Women') {
        return s.name.includes('(Women)') || s.category === 'Women' || s.category === 'Makeup' || s.category === 'Packages' || s.category === 'Body Care' || s.category === 'Facial' || s.category === 'Waxing';
      } else {
        return s.name.includes('(Men)') || s.category === 'Men';
      }
    });

    const grouped: Record<string, any[]> = {};
    genderMenu.forEach(s => {
      const cleanName = s.name.replace(/\s*\((Men|Women)\)/g, '');
      const category = s.category;
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push({ ...s, cleanName });
    });

    return grouped;
  }, [services, activeGender]);

  const categories = Object.keys(filteredMenu);

  return (
    <div className="min-h-screen text-white selection:bg-gold selection:text-black font-sans">
      {/* Navigation */}
      <header className="w-full py-6 px-8 flex justify-between items-center border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="text-xl md:text-2xl font-black tracking-[0.1em] text-white italic">
          EIRENE<span className="text-gold">SALON</span>
        </Link>
        <nav className="hidden md:flex gap-10 text-xs uppercase tracking-widest font-medium text-gray-400">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <Link href="/services" className="text-gold transition-colors">Services</Link>
          <Link href="/gallery" className="hover:text-gold transition-colors">Gallery</Link>
          <Link href="/contact" className="hover:text-gold transition-colors">Contact</Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase italic">
            Service <span className="text-gold">Menu</span>
          </h1>
          <p className="text-gray-500 tracking-[0.3em] text-xs uppercase font-bold">Excellence in beauty & grooming</p>
        </div>

        {/* Gender Toggle Switch - Plain CSS version */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/5 p-1 rounded-full border border-white/10 flex relative w-64 md:w-80">
            <button 
              onClick={() => setActiveGender('Women')}
              className={`flex-1 py-3 px-6 rounded-full text-xs font-black uppercase tracking-widest transition-all z-10 ${activeGender === 'Women' ? 'text-black bg-gold' : 'text-gray-400 hover:text-white'}`}
            >
              Women
            </button>
            <button 
              onClick={() => setActiveGender('Men')}
              className={`flex-1 py-3 px-6 rounded-full text-xs font-black uppercase tracking-widest transition-all z-10 ${activeGender === 'Men' ? 'text-black bg-gold' : 'text-gray-400 hover:text-white'}`}
            >
              Men
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-20 animate-fadeIn">
            {/* Gender-specific Hero Image */}
            <div className="relative w-full h-[300px] md:h-[450px] rounded-3xl overflow-hidden border border-white/10 group mb-16">
              <Image 
                src={activeGender === 'Women' ? '/women-hero.png' : '/men-hero.png'} 
                alt={`${activeGender} Salon Experience`}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 md:p-12">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic mb-2">
                  {activeGender === 'Women' ? 'Grace & Elegance' : 'Precision & Style'}
                </h2>
                <p className="text-gold uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold">
                  Premium {activeGender}'s Grooming Experience
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {categories.length === 0 ? (
                <div className="md:col-span-2 text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <p className="text-gray-500 italic">No services found for this selection.</p>
                </div>
              ) : (
                categories.map((cat) => (
                  <div key={cat} className="space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                        {cat === "Men" || cat === "Women" ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        ) : cat.includes("Hair") ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758L5 19m0-14l4.121 4.121" /></svg>
                        ) : cat.includes("Wax") ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                        )}
                      </div>
                      <h2 className="text-xl font-black tracking-[0.1em] uppercase text-white group-hover:text-gold transition-colors">{cat}</h2>
                      <div className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {filteredMenu[cat].map((service, idx) => (
                        <div 
                          key={service.id || idx}
                          className="group relative flex justify-between items-center p-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.07] hover:border-gold/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-300 overflow-hidden"
                        >
                          {/* Background Glow Effect */}
                          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gold/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          
                          <div className="flex-1 pr-4 relative z-10">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-base font-bold text-gray-200 group-hover:text-white transition-colors">{service.cleanName}</h3>
                              {service.price > 1000 && (
                                <span className="px-1.5 py-0.5 bg-gold/10 border border-gold/20 text-gold text-[8px] font-black uppercase tracking-widest rounded">Elite</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">{service.duration_mins || 60} MIN</span>
                              <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                              <span className="text-[9px] text-gray-600 uppercase tracking-widest">Starting at</span>
                            </div>
                          </div>
                          
                          
                          <div className="text-right flex flex-col justify-center items-end relative z-10">
                            {activeOffer ? (
                              <>
                                <span className="text-[10px] text-gray-500 line-through">₹{service.price}</span>
                                <span className="text-lg font-black text-green-400 italic whitespace-nowrap">
                                  ₹{Math.round(service.price * (1 - activeOffer.discount_percentage / 100))}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-black text-gold italic whitespace-nowrap">₹{service.price}</span>
                            )}
                            <Link 
                              href={`/book?service=${encodeURIComponent(service.name)}`}
                              className="mt-2 px-5 py-2 bg-white/5 text-white hover:bg-gold hover:text-black text-[9px] font-black uppercase tracking-widest rounded-xl border border-white/10 hover:border-gold transition-all"
                            >
                              Book
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="py-24 text-center">
        <div className="w-px h-24 bg-gradient-to-b from-gold/50 to-transparent mx-auto mb-8"></div>
        <p className="text-gray-600 text-[10px] tracking-[0.5em] uppercase">Unisex Salon & Spa &bull; Excellence in Every Detail</p>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
