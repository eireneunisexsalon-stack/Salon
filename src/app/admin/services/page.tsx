"use client";

import { useState, useEffect, useCallback } from 'react';
import { getServices, addService, deleteService, seedServices } from '../../actions/admin';

export default function ServicesManagement() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Men');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('60');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchServicesData = useCallback(async () => {
    setLoading(true);
    const data = await getServices();
    setServices(data || []);
    setLoading(false);
    return data || [];
  }, []);

  useEffect(() => {
    async function init() {
      const data = await fetchServicesData();
      if (data && data.length === 0) {
        console.log("Database empty, seeding default menu...");
        const seedResult = await seedServices();
        if (seedResult.success) {
          await fetchServicesData();
        }
      }
    }
    init();
  }, [fetchServicesData]);

  const handleSeed = async () => {
    if (!confirm("This will restore the FULL service menu (100+ items). Continue?")) return;
    setLoading(true);
    const result = await seedServices();
    if (result.success) {
      alert(`Success! Seeded ${result.count} services.`);
      await fetchServicesData();
    } else {
      alert("Failed to seed: " + result.error);
    }
    setLoading(false);
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    setIsSubmitting(true);
    const result = await addService({
      name,
      category,
      price: parseInt(price),
      duration_mins: parseInt(duration)
    });

    if (result.success) {
      setName('');
      setPrice('');
      setDuration('60');
      await fetchServicesData();
    } else {
      alert("Failed to add service. " + (result.error || ""));
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setServices(prev => prev.filter(s => s.id !== id));
    await deleteService(id);
  };

  const categories = ["Men", "Women", "Waxing", "Facial", "Skincare", "Mani/Pedi", "Massage", "Hair Spa", "Hair Care", "Hair Treatments", "Hair Styling", "Makeup", "Packages", "Body Care", "Hair Color"];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gold">Services Management</h1>
        <button 
          onClick={handleSeed}
          className="px-6 py-2 bg-gold/10 border border-gold/30 text-gold text-xs font-bold rounded hover:bg-gold hover:text-black transition-all uppercase tracking-widest"
        >
          Restore Full Service Menu
        </button>
      </div>

      {/* Add New Service Form */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-xl mb-12">
        <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Add New Service</h2>
        <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-400">Service Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Classic Haircut" 
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Price (₹)</label>
            <input 
              type="number" 
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 500" 
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold"
            />
          </div>
          <div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-2 bg-gold text-black font-bold rounded-md uppercase tracking-wider text-sm disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Service"}
            </button>
          </div>
        </form>
      </div>

      {/* Services List */}
      <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Your Current Menu ({services.length} items)</h2>
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading menu...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400">Service Name</th>
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400">Category</th>
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400">Price</th>
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service: any) => (
                <tr key={service.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold">{service.name}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded text-[10px] uppercase tracking-widest bg-white/10 text-gray-400 border border-white/5">
                      {service.category}
                    </span>
                  </td>
                  <td className="p-4 text-gold font-bold">₹{service.price}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(service.id)}
                      className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded hover:bg-red-500 hover:text-white transition-colors text-xs uppercase tracking-wider"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No services found. Click "Restore Full Service Menu" to populate.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
