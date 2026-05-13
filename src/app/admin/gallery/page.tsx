'use client';

import { useState, useEffect } from 'react';
import { getGalleryImages, uploadGalleryImage, deleteGalleryImage } from '@/app/actions/gallery';
import Image from 'next/image';

export default function GalleryAdmin() {
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      setLoading(true);
      const data = await getGalleryImages();
      setImages(data);
    } catch (error: any) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      
      setUploading(true);
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadGalleryImage(formData);

      if (result.success) {
        alert('Image uploaded successfully!');
        fetchImages();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string, url: string) {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const result = await deleteGalleryImage(id, url);
      if (result.success) {
        setImages(images.filter(img => img.id !== id));
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 italic uppercase">Gallery <span className="text-gold">Management</span></h1>
          <p className="text-gray-400 text-xs uppercase tracking-widest">Upload and manage images displayed on the website.</p>
        </div>
        
        <label className={`cursor-pointer bg-gold text-black px-6 py-3 rounded-md font-bold uppercase tracking-widest text-xs hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] ${uploading ? 'opacity-50' : ''}`}>
          {uploading ? 'Uploading...' : 'Upload New Image'}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
          <p className="text-gray-500 text-xs uppercase tracking-widest">No images in the gallery yet. Start by uploading one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image.id} className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5">
              <Image
                src={image.url}
                alt={image.alt || 'Gallery image'}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  onClick={() => handleDelete(image.id, image.url)}
                  className="bg-red-500/80 hover:bg-red-500 text-white p-3 rounded-full transition-colors"
                  title="Delete Image"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
