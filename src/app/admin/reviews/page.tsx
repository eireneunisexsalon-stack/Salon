"use client";

import { useState, useEffect } from 'react';
import { getReviews, deleteReview, toggleReviewVisibility } from '@/app/actions/reviews';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    setLoading(true);
    const data = await getReviews();
    setReviews(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const result = await deleteReview(id);
    if (result.success) {
      await loadReviews();
    }
  }

  async function handleToggle(id: string, currentStatus: boolean) {
    const result = await toggleReviewVisibility(id, !currentStatus);
    if (result.success) {
      await loadReviews();
    }
  }

  if (loading) {
    return <div className="p-8 text-white">Loading reviews...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <header className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Customer <span className="text-gold">Reviews</span></h1>
          <p className="text-gray-400 text-xs tracking-widest uppercase mt-2">Monitor and moderate client feedback</p>
        </div>
      </header>

      {reviews.length === 0 ? (
        <div className="p-20 border border-white/5 bg-white/[0.02] rounded-3xl text-center text-gray-500 text-xs uppercase tracking-widest">
          No reviews submitted yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl hover:border-white/20 transition-all group">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold">
                      {review.customer_name[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{review.customer_name}</h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-1 ml-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < review.rating ? 'text-gold' : 'text-gray-700'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 italic leading-relaxed text-lg">"{review.comment}"</p>
                </div>

                <div className="flex md:flex-col items-center justify-center gap-4">
                  <button 
                    onClick={() => handleToggle(review.id, review.is_published)}
                    className={`px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors border ${review.is_published ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/30 hover:bg-white hover:text-black'}`}
                  >
                    {review.is_published ? 'Published' : 'Draft'}
                  </button>
                  <button 
                    onClick={() => handleDelete(review.id)}
                    className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
