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
      const nameLower = s.name.toLowerCase();
      const catLower = (s.category || '').toLowerCase();
      
      // Robust, case-insensitive gender matching
      const isMen = catLower === 'men' || nameLower.includes('(men)') || nameLower.includes(' - men') || nameLower.endsWith(' men');
      
      if (activeGender === 'Women') {
        return !isMen;
      } else {
        return isMen;
      }
    });

    const grouped: Record<string, any[]> = {};
    genderMenu.forEach(s => {
      const cleanName = s.name.replace(/\s*\((Men|Women)\)/g, '');
      let category = s.category;

      // Dynamically sub-categorize "Women" category into distinct luxury sections
      if (category === 'Women') {
        const nameLower = s.name.toLowerCase();
        if (nameLower.includes('cut')) {
          category = 'Hair Styling & Cut';
        } else if (nameLower.includes('makeup') || nameLower.includes('bridal') || nameLower.includes('party')) {
          category = 'Makeup & Styling';
        } else if (nameLower.includes('massage') || nameLower.includes('pedi') || nameLower.includes('mani') || nameLower.includes('coconut')) {
          category = 'Mani / Pedi & Wellness';
        } else if (nameLower.includes('wax') || nameLower.includes('arms') || nameLower.includes('legs')) {
          category = 'Waxing Services';
        } else if (nameLower.includes('threading') || nameLower.includes('lips') || nameLower.includes('vlcc') || nameLower.includes('facial') || nameLower.includes('lotus') || nameLower.includes('o3') || nameLower.includes('ragga')) {
          category = 'Facial & Skincare';
        } else if (nameLower.includes('dandruff') || nameLower.includes('hairfall') || nameLower.includes('spa')) {
          category = 'Hair Spa & Care';
        } else if (nameLower.includes('straightening') || nameLower.includes('curl') || nameLower.includes('keratin') || nameLower.includes('botox') || nameLower.includes('smoothning') || nameLower.includes('smoothing') || nameLower.includes('nanoplastia')) {
          category = 'Hair Treatments';
        } else if (nameLower.includes('wash') || nameLower.includes('streax') || nameLower.includes('loreal') || s.name === 'Normal') {
          category = 'Hair Wash & Conditioning';
        } else {
          category = 'Premium Beauty Care';
        }
      }

      if (!grouped[category]) grouped[category] = [];
      grouped[category].push({ ...s, cleanName });
    });

    return grouped;
  }, [services, activeGender]);

  const categories = Object.keys(filteredMenu);

  // Split categories using a Greedy Height-Balancing Algorithm
  const leftCategories: string[] = [];
  const rightCategories: string[] = [];
  let leftHeight = 0;
  let rightHeight = 0;

  // We loop through the categories, placing each category into the column that is currently shorter.
  // This guarantees that the heights of the Left and Right columns are as close to equal as possible!
  categories.forEach((cat) => {
    const catHeight = filteredMenu[cat].length * 80 + 150;
    if (leftHeight <= rightHeight) {
      leftCategories.push(cat);
      leftHeight += catHeight;
    } else {
      rightCategories.push(cat);
      rightHeight += catHeight;
    }
  });

  const isLeftShorter = leftHeight < rightHeight;

  // Render SVG icons dynamically for each category
  const getCategoryIcon = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes("men")) {
      return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
    } else if (c.includes("hair")) {
      return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758L5 19m0-14l4.121 4.121" /></svg>;
    } else if (c.includes("wax")) {
      return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
    } else if (c.includes("spa") || c.includes("massage") || c.includes("pedi") || c.includes("mani")) {
      return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>;
    } else if (c.includes("facial") || c.includes("skin")) {
      return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    } else if (c.includes("makeup")) {
      return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
    } else {
      return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
    }
  };

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

            {categories.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <p className="text-gray-500 italic">No services found for this selection.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Left Column */}
                <div className="space-y-12">
                  {leftCategories.map((cat) => (
                    <div key={cat} className="space-y-6 group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                          {getCategoryIcon(cat)}
                        </div>
                        <h2 className="text-xl font-black tracking-[0.1em] uppercase text-white group-hover:text-gold transition-colors">{cat}</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent"></div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {filteredMenu[cat].map((service, idx) => (
                          <div 
                            key={service.id || idx}
                            className="group/item relative flex justify-between items-center p-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.07] hover:border-gold/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-300 overflow-hidden"
                          >
                            {/* Background Glow Effect */}
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gold/5 rounded-full blur-2xl opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                            
                            <div className="flex-1 pr-4 relative z-10">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-base font-bold text-gray-200 group-hover/item:text-white transition-colors">{service.cleanName}</h3>
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
                  ))}

                  {/* Dynamic Ritual card to balance masonry column height mismatch - Left Column */}
                  {activeGender !== 'Men' && isLeftShorter && (
                    <div className="bg-gradient-to-br from-gold/10 via-black to-white/[0.02] border border-gold/20 p-8 rounded-3xl relative overflow-hidden group shadow-[0_0_50px_rgba(212,175,55,0.05)] mt-6">
                      <div className="absolute -right-12 -top-12 w-48 h-48 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/20 transition-colors"></div>
                      <span className="text-[10px] text-gold font-black uppercase tracking-[0.3em] mb-2 block">
                        Luxury Indulgence
                      </span>
                      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic text-white mb-4">
                        THE EMPRESS <span className="text-gold">EXPERIENCE</span>
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed mb-6">
                        Immerse yourself in supreme relaxation. Our custom bridal styling, premium skincare facials, and advanced hair rejuvenating treatments are crafted to bring out your natural, royal glow.
                      </p>
                      <ul className="space-y-3 mb-8 text-xs text-gray-300">
                        <li className="flex items-center gap-2"><span className="text-gold">✓</span> Aromatherapy and premium herbal teas</li>
                        <li className="flex items-center gap-2"><span className="text-gold">✓</span> Gold facial mask & luxury hand massage</li>
                        <li className="flex items-center gap-2"><span className="text-gold">✓</span> Customized hair & beauty analysis</li>
                      </ul>
                      <Link 
                        href="/book" 
                        className="inline-block px-8 py-3 bg-gold text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] font-bold"
                      >
                        Book The Experience
                      </Link>
                    </div>
                  )}

                  {/* Render Philosophy Card in Left column to fill empty space if Left is TALLER */}
                  {activeGender !== 'Men' && !isLeftShorter && (
                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl relative overflow-hidden group mt-6 shadow-[0_0_50px_rgba(255,255,255,0.02)]">
                      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-white/[0.02] rounded-full blur-3xl"></div>
                      <span className="text-[10px] text-gold font-black uppercase tracking-[0.3em] mb-2 block">Our Philosophy</span>
                      <p className="text-white font-bold italic text-lg leading-relaxed mb-4">
                        "Beauty is not about matching some standard; it's about celebrating your own unique light and elegance."
                      </p>
                      <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">— EIRENE SALON CRAFTSMANSHIP</p>
                    </div>
                  )}

                  {/* For Men's section: Left column Philosophy Card */}
                  {activeGender === 'Men' && (
                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl relative overflow-hidden group mt-6 shadow-[0_0_50px_rgba(255,255,255,0.02)]">
                      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-white/[0.02] rounded-full blur-3xl"></div>
                      <span className="text-[10px] text-gold font-black uppercase tracking-[0.3em] mb-2 block">Our Philosophy</span>
                      <p className="text-white font-bold italic text-lg leading-relaxed mb-4">
                        "Precision grooming is more than a cut; it's an architectural standard of confidence and presence."
                      </p>
                      <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">— EIRENE SALON CRAFTSMANSHIP</p>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-12">
                  {rightCategories.map((cat) => (
                    <div key={cat} className="space-y-6 group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                          {getCategoryIcon(cat)}
                        </div>
                        <h2 className="text-xl font-black tracking-[0.1em] uppercase text-white group-hover:text-gold transition-colors">{cat}</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent"></div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {filteredMenu[cat].map((service, idx) => (
                          <div 
                            key={service.id || idx}
                            className="group/item relative flex justify-between items-center p-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.07] hover:border-gold/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-300 overflow-hidden"
                          >
                            {/* Background Glow Effect */}
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gold/5 rounded-full blur-2xl opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                            
                            <div className="flex-1 pr-4 relative z-10">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-base font-bold text-gray-200 group-hover/item:text-white transition-colors">{service.cleanName}</h3>
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
                  ))}

                  {/* Dynamic Ritual card to balance masonry column height mismatch - Right Column */}
                  {(activeGender === 'Men' || (activeGender !== 'Men' && !isLeftShorter)) && (
                    <div className="bg-gradient-to-br from-gold/10 via-black to-white/[0.02] border border-gold/20 p-8 rounded-3xl relative overflow-hidden group shadow-[0_0_50px_rgba(212,175,55,0.05)] mt-6">
                      <div className="absolute -right-12 -top-12 w-48 h-48 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/20 transition-colors"></div>
                      <span className="text-[10px] text-gold font-black uppercase tracking-[0.3em] mb-2 block">
                        {activeGender === 'Men' ? 'Premium Experience' : 'Luxury Indulgence'}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic text-white mb-4">
                        {activeGender === 'Men' ? (
                          <>THE GENTLEMAN'S <span className="text-gold">RITUAL</span></>
                        ) : (
                          <>THE EMPRESS <span className="text-gold">EXPERIENCE</span></>
                        )}
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed mb-6">
                        {activeGender === 'Men' ? (
                          "Elevate your grooming game with our signature treatments. From precision skin-fades to absolute luxury hot-towel shaves, we offer a dedicated space for the modern man who values excellence in every single detail."
                        ) : (
                          "Immerse yourself in supreme relaxation. Our custom bridal styling, premium skincare facials, and advanced hair rejuvenating treatments are crafted to bring out your natural, royal glow."
                        )}
                      </p>
                      <ul className="space-y-3 mb-8 text-xs text-gray-300">
                        {activeGender === 'Men' ? (
                          <>
                            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Complimentary premium beverage</li>
                            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Scalp massage & hot towel treatment</li>
                            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Personal style consultation included</li>
                          </>
                        ) : (
                          <>
                            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Aromatherapy and premium herbal teas</li>
                            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Gold facial mask & luxury hand massage</li>
                            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Customized hair & beauty analysis</li>
                          </>
                        )}
                      </ul>
                      <Link 
                        href="/book" 
                        className="inline-block px-8 py-3 bg-gold text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] font-bold"
                      >
                        {activeGender === 'Men' ? 'Book The Ritual' : 'Book The Experience'}
                      </Link>
                    </div>
                  )}

                  {/* Render Philosophy Card in Right column to fill empty space if Right is TALLER (Left is shorter) */}
                  {activeGender !== 'Men' && isLeftShorter && (
                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl relative overflow-hidden group mt-6 shadow-[0_0_50px_rgba(255,255,255,0.02)]">
                      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-white/[0.02] rounded-full blur-3xl"></div>
                      <span className="text-[10px] text-gold font-black uppercase tracking-[0.3em] mb-2 block">Our Philosophy</span>
                      <p className="text-white font-bold italic text-lg leading-relaxed mb-4">
                        "Beauty is not about matching some standard; it's about celebrating your own unique light and elegance."
                      </p>
                      <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">— EIRENE SALON CRAFTSMANSHIP</p>
                    </div>
                  )}
                </div>
              </div>
            )}
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
