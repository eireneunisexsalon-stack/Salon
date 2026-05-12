import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import Header from '../components/Header';
import AmbientParticles from '../components/AmbientParticles';

// Disable caching to always fetch the latest gallery images
export const revalidate = 0;

export default async function GalleryPage() {
  // Fetch Gallery Images
  const { data: galleryImages } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-gold selection:text-black">
      <Header />
      <AmbientParticles />

      <main className="relative pt-32 pb-20 px-8 max-w-7xl mx-auto z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-4">
            Our <span className="text-gold">Gallery</span>
          </h1>
          <p className="text-gray-400 tracking-[0.2em] text-xs md:text-sm uppercase max-w-2xl mx-auto leading-relaxed">
            A showcase of our finest work, premium styling, and the luxurious Eirene Salon experience.
          </p>
        </div>

        {galleryImages && galleryImages.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryImages.map((img: any, index: number) => (
              <div 
                key={img.id} 
                className="relative overflow-hidden rounded-2xl group break-inside-avoid shadow-[0_0_20px_rgba(212,175,55,0.05)] border border-white/5 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
              >
                <img 
                  src={img.image_url} 
                  alt={img.title || "Gallery Image"} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  {img.title && <h3 className="text-gold font-bold italic text-xl uppercase tracking-wider">{img.title}</h3>}
                  {img.category && <p className="text-gray-300 text-xs tracking-widest uppercase mt-2">{img.category}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.02]">
            <p className="text-gray-500 tracking-[0.2em] uppercase">No gallery images available yet.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative py-12 text-center text-gray-600 text-[10px] tracking-widest uppercase border-t border-white/5 z-10">
        &copy; {new Date().getFullYear()} Eirene Salon. All Rights Reserved.
      </footer>
    </div>
  );
}
