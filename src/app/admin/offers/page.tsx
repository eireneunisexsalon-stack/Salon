"use client";

import { useState, useEffect } from 'react';
import { getOffers, createOffer, updateOfferStatus, deleteOffer } from '@/app/actions/offers';

export default function OffersAdminPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadOffers();
  }, []);

  async function loadOffers() {
    setLoading(true);
    const data = await getOffers();
    setOffers(data);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description || discountPercentage <= 0 || !startDate || !endDate) return;

    setIsSubmitting(true);
    const result = await createOffer({
      title,
      description,
      discount_percentage: discountPercentage,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString()
    });

    if (result.success) {
      setTitle('');
      setDescription('');
      setDiscountPercentage(10);
      setStartDate('');
      setEndDate('');
      await loadOffers();
    } else {
      alert("Failed to create offer: " + result.error);
    }
    setIsSubmitting(false);
  }

  async function handleToggleStatus(id: string, currentStatus: boolean) {
    const result = await updateOfferStatus(id, !currentStatus);
    if (result.success) {
      await loadOffers();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    const result = await deleteOffer(id);
    if (result.success) {
      await loadOffers();
    }
  }

  if (loading) {
    return <div className="p-8 text-white">Loading offers...</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <header className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Promotional <span className="text-gold">Offers</span></h1>
          <p className="text-gray-400 text-xs tracking-widest uppercase mt-2">Manage live discounts and homepage banners</p>
        </div>
      </header>

      {/* Create Offer Form */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Create New Offer</h2>
        
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Offer Title (Banner Headline)</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. MONSOON SPECIAL" 
                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white outline-none focus:border-gold transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Discount Percentage</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={discountPercentage}
                  onChange={e => setDiscountPercentage(Number(e.target.value))}
                  min="1"
                  max="100"
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white outline-none focus:border-gold transition-colors pl-12"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Valid From</label>
              <input 
                type="datetime-local" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white outline-none focus:border-gold transition-colors"
                style={{ colorScheme: 'dark' }}
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Valid Until</label>
              <input 
                type="datetime-local" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white outline-none focus:border-gold transition-colors"
                style={{ colorScheme: 'dark' }}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Offer Description</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Get 20% off on all services this weekend!" 
              className="w-full bg-black border border-white/10 rounded-lg p-3 text-white outline-none focus:border-gold transition-colors h-24 resize-none"
              required
            ></textarea>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-8 py-3 bg-gold text-black font-black rounded-lg uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Offer'}
          </button>
        </form>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">All Offers</h2>
        
        {offers.length === 0 ? (
          <div className="p-8 border border-white/5 bg-white/[0.02] rounded-xl text-center text-gray-500 text-xs uppercase tracking-widest">
            No offers created yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {offers.map(offer => (
              <div key={offer.id} className={`p-6 border rounded-2xl flex flex-col md:flex-row justify-between gap-6 items-start md:items-center transition-all ${offer.is_active ? 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'border-white/10 bg-[#0a0a0a]'}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-black text-white italic uppercase tracking-wider">{offer.title}</h3>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-gold font-bold text-xs">{offer.discount_percentage}% OFF</span>
                    {offer.is_active && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full font-bold text-[10px] uppercase tracking-widest animate-pulse border border-green-500/30">
                        Live on Website
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{offer.description}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    Valid: {new Date(offer.start_date).toLocaleDateString()} - {new Date(offer.end_date).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <button 
                    onClick={() => handleToggleStatus(offer.id, offer.is_active)}
                    className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors border ${offer.is_active ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' : 'bg-gold/10 text-gold border-gold/30 hover:bg-gold hover:text-black'}`}
                  >
                    {offer.is_active ? 'Deactivate' : 'Activate Live'}
                  </button>
                  <button 
                    onClick={() => handleDelete(offer.id)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-white/5 rounded-lg transition-colors"
                    title="Delete Offer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
