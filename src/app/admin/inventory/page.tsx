"use client";

import { useState, useEffect } from 'react';
import { getProducts, addProduct, deleteProduct } from '../../actions/inventory';

export default function InventoryManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock || !date) return;

    setIsSubmitting(true);
    const result = await addProduct({
      name,
      brand: "", // Omit brand in UI, passing empty string to comply with optional DB schema
      price: parseInt(price),
      stock: parseInt(stock),
      created_at: new Date(date).toISOString() // Override created_at with custom date selected
    });

    if (result.success) {
      // Reset form and refresh list
      setName('');
      setPrice('');
      setStock('10');
      setDate(new Date().toISOString().split('T')[0]);
      await fetchProducts();
    } else {
      alert("Failed to add product. " + (result.error || ""));
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    // Optimistic UI update
    setProducts(prev => prev.filter(s => s.id !== id));
    
    await deleteProduct(id);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gold">Salon Inventory</h1>

      {/* Add New Product Form */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-xl mb-12">
        <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-400">Product Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Argan Oil Hair Serum" 
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Price (₹)</label>
            <input 
              type="number" 
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 1200" 
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Pieces (Qty)</label>
            <input 
              type="number" 
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="e.g. 10" 
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">Date</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ colorScheme: 'dark' }}
              className="w-full p-2 bg-black border border-white/20 rounded-md text-white outline-none focus:border-gold text-sm"
            />
          </div>
          <div className="md:col-span-5 flex justify-end mt-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2 bg-gold text-black font-bold rounded-md uppercase tracking-wider text-xs disabled:opacity-50 hover:bg-white hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all h-[38px]"
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>

      {/* Products List */}
      <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Current Stock</h2>
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading inventory...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400">Date</th>
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400">Product Name</th>
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400">Pieces (Stock)</th>
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400">Retail Price</th>
                <th className="p-4 text-sm uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: any) => {
                const formattedDate = new Date(product.created_at).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                });
                return (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-gray-400 text-sm">{formattedDate}</td>
                    <td className="p-4 font-bold">{product.name}</td>
                    <td className="p-4 text-gray-300">
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold">
                        {product.stock || 0} pcs
                      </span>
                    </td>
                    <td className="p-4 text-gold font-bold">₹{product.price}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded hover:bg-red-500 hover:text-white transition-colors text-xs uppercase tracking-wider"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No products in inventory. Add some using the form above!
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
