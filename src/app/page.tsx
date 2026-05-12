import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import Header from './components/Header';

export default async function Home() {

  // Fetch Gallery Images
  const { data: galleryImages } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  const displayGallery = galleryImages && galleryImages.length > 0 
    ? galleryImages 
    : [
        { id: '1', url: '/gallery_1.png', alt: 'Barbering' },
        { id: '2', url: '/gallery_2.png', alt: 'Hair Styling' },
      ];

  return (
    <div className="flex flex-col min-h-screen selection:bg-gold selection:text-black">
      <Header />

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/eirene-brand.png" 
            alt="Eirene Salon Premium Interior" 
            fill 
            className="object-cover object-center opacity-60 contrast-110 animate-ken-burns"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020202]/70 via-transparent to-[#020202]"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center max-w-4xl mt-10 animate-fade-up">
          <p className="text-gold uppercase tracking-[0.3em] text-sm md:text-base font-semibold mb-6 delay-1">
            Luxury Grooming for Everyone
          </p>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] italic delay-2">
            REDEFINE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-white to-gold">YOUR STYLE</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-12 font-light leading-relaxed delay-3">
            Experience the pinnacle of hair and beauty care. Our expert stylists deliver personalized treatments for both men and women in an atmosphere of pure luxury.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 delay-4">
            <Link href="/book" className="px-10 py-4 bg-gold text-black uppercase tracking-widest text-sm font-bold rounded-xl hover:bg-white hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              Reserve a Chair
            </Link>
            <Link href="/services" className="px-10 py-4 bg-black/50 backdrop-blur-xl border border-white/20 text-white uppercase tracking-widest text-sm font-bold rounded-xl hover:border-gold hover:text-gold transition-all duration-300">
              Our Services
            </Link>
          </div>
        </div>
      </main>

      {/* Unisex Categories Section */}
      <section className="py-32 px-8 relative z-10 border-t border-white/5 overflow-hidden">
        {/* Subtle texture overlay like Artists section */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
        
        {/* Dramatic Background Glows */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gold/10 rounded-full blur-[150px] -ml-96 -mt-96 pointer-events-none animate-pulse duration-[10s]"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gold/10 rounded-full blur-[150px] -mr-96 -mb-96 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">Our Expertise</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 italic">CRAFTED FOR ALL</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
              Bespoke services tailored to your unique style, delivered with uncompromising excellence and attention to detail.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            {/* For Her */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0a0a0a] transition-all duration-500 hover:bg-[#111111] hover:border-white/10 hover:shadow-[0_0_40px_rgba(212,175,55,0.05)] animate-fade-up delay-1">
              {/* Subtle background glow */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/5 rounded-full blur-[100px] group-hover:bg-gold/10 transition-colors duration-700 pointer-events-none"></div>
              
              <div className="p-10 md:p-14 lg:p-16 relative z-10 flex flex-col h-full">
                <div className="mb-8">
                  <h3 className="text-4xl md:text-5xl font-light mb-2 tracking-tight">For <span className="text-gold italic">Her</span></h3>
                  <div className="w-12 h-px bg-gradient-to-r from-gold to-transparent mt-6"></div>
                </div>
                
                <p className="text-gray-400 mb-10 text-lg font-light leading-relaxed flex-grow">
                  From precision cuts and transformative coloring to luxury keratin treatments and bridal makeovers. Elevate your natural beauty.
                </p>
                
                <ul className="space-y-4 text-sm tracking-wide text-gray-300 mb-14">
                  {['Balayage & Highlights', 'Bridal & Party Makeup', 'Premium Hair Spa'].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 group/item">
                      <div className="w-6 h-px bg-gold/30 group-hover/item:bg-gold group-hover/item:w-8 transition-all duration-300"></div>
                      <span className="group-hover/item:text-white transition-colors duration-300">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/services" className="inline-flex items-center gap-3 text-gold uppercase tracking-widest text-xs font-bold group-hover:gap-5 transition-all duration-300 w-max mt-auto">
                  <span>View Womens Menu</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* For Him */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0a0a0a] transition-all duration-500 hover:bg-[#111111] hover:border-white/10 hover:shadow-[0_0_40px_rgba(212,175,55,0.05)] animate-fade-up delay-2">
              {/* Subtle background glow */}
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gold/5 rounded-full blur-[100px] group-hover:bg-gold/10 transition-colors duration-700 pointer-events-none"></div>
              
              <div className="p-10 md:p-14 lg:p-16 relative z-10 flex flex-col h-full">
                <div className="mb-8">
                  <h3 className="text-4xl md:text-5xl font-light mb-2 tracking-tight">For <span className="text-gold italic">Him</span></h3>
                  <div className="w-12 h-px bg-gradient-to-r from-gold to-transparent mt-6"></div>
                </div>
                
                <p className="text-gray-400 mb-10 text-lg font-light leading-relaxed flex-grow">
                  Classic fades, hot towel shaves, and meticulous beard sculpting. The modern gentleman's sanctuary for immaculate grooming.
                </p>
                
                <ul className="space-y-4 text-sm tracking-wide text-gray-300 mb-14">
                  {['Signature Fades & Tapers', 'Hot Towel Straight Razor Shave', 'Beard Sculpting & Oil Treatment'].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 group/item">
                      <div className="w-6 h-px bg-gold/30 group-hover/item:bg-gold group-hover/item:w-8 transition-all duration-300"></div>
                      <span className="group-hover/item:text-white transition-colors duration-300">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/services" className="inline-flex items-center gap-3 text-gold uppercase tracking-widest text-xs font-bold group-hover:gap-5 transition-all duration-300 w-max mt-auto">
                  <span>View Mens Menu</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Artists (Team) Section */}
      <section className="py-32 px-8 bg-transparent relative z-10 border-t border-white/5 overflow-hidden">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 italic uppercase">Meet Our <span className="text-gold">Artists</span></h2>
            <div className="w-24 h-1 bg-gold mx-auto rounded-full mb-8 shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
            <p className="text-gray-500 max-w-2xl mx-auto uppercase tracking-widest text-[10px] font-bold">The masters behind the magic. Our leading experts in grooming & styling.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Female Artist */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden mb-6 border-2 border-transparent group-hover:border-gold transition-all duration-500 shadow-xl">
                <Image src="/artist_female.png" alt="Master Stylist" fill className="object-cover transition-all duration-700" />
              </div>
              <h3 className="text-2xl font-bold tracking-wide">ANU</h3>
              <p className="text-gold tracking-widest text-sm uppercase mb-3">Master Stylist & Makeup Artist</p>
              <p className="text-gray-500 text-sm max-w-xs">With years of expertise in high-end styling, bridal makeup, and color theory, Anu crafts looks that perfectly complement your natural features.</p>
            </div>

            {/* Male Artist */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden mb-6 border-2 border-transparent group-hover:border-gold transition-all duration-500 shadow-xl">
                <Image src="/artist_male.png" alt="Master Barber" fill className="object-cover transition-all duration-700" />
              </div>
              <h3 className="text-2xl font-bold tracking-wide">SANDEEP</h3>
              <p className="text-gold tracking-widest text-sm uppercase mb-3">Master Barber & Grooming Expert</p>
              <p className="text-gray-500 text-sm max-w-xs">Specializing in classic fades, precision cuts, and beard architecture. Sandeep delivers the ultimate modern gentleman's grooming experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 px-4 bg-transparent relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">THE GALLERY</h2>
            <div className="w-16 h-1 bg-gold mx-auto rounded-full mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {displayGallery.map((item: any, i: number) => (
              <div key={item.id || i} className="relative h-64 w-full rounded-lg overflow-hidden group">
                <Image 
                  src={item.url} 
                  alt={item.alt || 'Gallery image'} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/gallery" className="text-gold uppercase tracking-widest text-xs font-bold border-b border-gold pb-1 hover:text-white hover:border-white transition-all">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 px-8 bg-transparent relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">CLIENT REVIEWS</h2>
            <div className="w-16 h-1 bg-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah L.", review: "Absolutely phenomenal experience. Elena understood exactly what I wanted with my balayage. The luxury spa treatment felt like heaven.", stars: 5 },
              { name: "David K.", review: "Best fade and beard trim I've ever had. Marcus is a true artist. The hot towel shave is a must-try for any guy.", stars: 5 },
              { name: "Priya M.", review: "The ambiance is incredibly premium. It really feels like a VIP experience from the moment you walk in. Will definitely be returning.", stars: 5 }
            ].map((r, i) => (
              <div key={i} className="p-8 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex gap-1 mb-4">
                  {[...Array(r.stars)].map((_, idx) => (
                    <span key={idx} className="text-gold text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-300 italic mb-6 leading-relaxed">"{r.review}"</p>
                <p className="font-bold tracking-wide uppercase text-sm">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map & Contact Section */}
      <section className="py-24 px-8 bg-transparent relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-12">
            {/* Map Placeholder */}
            <div className="h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl bg-white/5">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112005.16104445831!2d77.10091819662776!3d28.644186596181467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1714000000000!5m2!1sen!2sin" 
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 bg-white/5 p-10 rounded-2xl border border-white/10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">CONTACT US</h2>
                <div className="w-16 h-1 bg-gold rounded-full mb-8"></div>
                
                <div className="flex flex-wrap gap-10 text-gray-300">
                  <div>
                    <h4 className="text-gold font-bold uppercase tracking-widest text-sm mb-2">Location</h4>
                    <p className="text-lg">Premium Salon Hub<br/>Your City, India</p>
                  </div>
                  <div>
                    <h4 className="text-gold font-bold uppercase tracking-widest text-sm mb-2">Hours</h4>
                    <p className="text-lg">Monday - Sunday<br/>10:00 AM - 08:30 PM</p>
                  </div>
                  <div>
                    <h4 className="text-gold font-bold uppercase tracking-widest text-sm mb-2">Get in Touch</h4>
                    <p className="text-lg">📞 7087726684<br/>📞 7986098228</p>
                  </div>
                  <div>
                    <h4 className="text-gold font-bold uppercase tracking-widest text-sm mb-2">Follow Us</h4>
                    <div className="flex gap-4 mt-2">
                      <a href="https://instagram.com/eirene_unisex_salon" target="_blank" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors bg-black/20">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="https://facebook.com" target="_blank" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors bg-black/20">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 xl:mt-0 w-full xl:w-auto text-center xl:text-left">
                <Link href="/book" className="inline-block w-full xl:w-auto px-10 py-5 bg-gold text-black uppercase tracking-widest text-sm font-bold rounded hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] whitespace-nowrap">
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-gray-500 text-sm bg-black relative z-10">
        <div className="text-2xl font-black tracking-[0.1em] text-white/50 mb-6 italic">
          EIRENE<span className="text-gold/50">SALON</span>
        </div>
        <p className="tracking-wider">&copy; {new Date().getFullYear()} Eirene Salon. All rights reserved.</p>
        <div className="mt-6">
          <Link href="/admin" className="text-xs text-gray-700 hover:text-gold transition-colors tracking-widest uppercase">
            Owner / Admin Login
          </Link>
        </div>
      </footer>
    </div>
  );
}
