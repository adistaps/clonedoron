'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

interface Deal {
  id: string;
  product_id: string;
  title: string;
  discount_percent: number;
  start_date: string;
  end_date: string;
}

interface Product {
  id: string;
  name: string;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Creation form states
  const [form, setForm] = useState<Partial<Deal>>({
    title: '',
    product_id: '',
    discount_percent: 10,
    start_date: '',
    end_date: '',
  });

  const fetchData = async () => {
    setLoading(true);
    const [dealsRes, productsRes] = await Promise.all([
      supabase.from('deals').select('*'),
      supabase.from('products').select('id, name'),
    ]);

    if (dealsRes.error) console.error('Error fetching deals', dealsRes.error);
    else setDeals(dealsRes.data as Deal[]);

    if (productsRes.error) console.error('Error fetching products', productsRes.error);
    else setProducts(productsRes.data as Product[]);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'discount_percent' ? Number(value) : value,
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('deals').insert([form]);
    if (error) {
      alert(`Error creating deal: ${error.message}`);
    } else {
      setForm({
        title: '',
        product_id: '',
        discount_percent: 10,
        start_date: '',
        end_date: '',
      });
      fetchData();
    }
    setSubmitting(false);
  };

  const deleteDeal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;
    const { error } = await supabase.from('deals').delete().eq('id', id);
    if (error) console.error('Delete error', error);
    else fetchData();
  };

  const getProductName = (id: string) => {
    return products.find(p => p.id === id)?.name || 'Unknown Product';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
          Deals Management
        </h1>
        <p className="text-[#555555] text-sm mt-1">Configure active promotional tags, campaigns, and discounts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Deal creation form */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-2xl h-fit">
          <h2 className="text-sm font-bold text-[#111111] mb-5 flex items-center gap-2">
            <i className="fa-solid fa-plus text-[#E8784A]"></i>
            Add Promotion / Deal
          </h2>
          <form className="space-y-4" onSubmit={handleCreate}>
            <div>
              <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-tag text-[#888888]"></i> Campaign Title
              </label>
              <input
                name="title"
                placeholder="Summer Sale Blast"
                value={form.title || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-sm focus:outline-none transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                Target Product
              </label>
              <select
                name="product_id"
                value={form.product_id || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-sm focus:outline-none transition-all duration-200"
                required
              >
                <option value="">Select a product...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-percent text-[#888888]"></i> Discount Percent (%)
              </label>
              <input
                name="discount_percent"
                type="number"
                min="1"
                max="100"
                value={form.discount_percent || 10}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-sm focus:outline-none transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-calendar text-[#888888]"></i> Start Date
              </label>
              <input
                name="start_date"
                type="date"
                value={form.start_date || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-sm focus:outline-none transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-calendar text-[#888888]"></i> End Date
              </label>
              <input
                name="end_date"
                type="date"
                value={form.end_date || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-sm focus:outline-none transition-all duration-200"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#E8784A] hover:bg-[#D76739] text-white py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {submitting ? 'Creating...' : 'Create Deal'}
            </button>
          </form>
        </div>

        {/* Display listing */}
        <div className="lg:col-span-2 bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-2xl">
          <h2 className="text-sm font-bold text-[#111111] mb-5">Active Campaigns ({deals.length})</h2>
          {loading ? (
            <p className="text-[#888888] text-sm">Loading promotions...</p>
          ) : deals.length === 0 ? (
            <p className="text-[#888888] text-sm">No promotional campaigns registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#555555] text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4 text-center">Discount</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {deals.map(deal => (
                    <tr key={deal.id} className="text-sm text-[#555555] hover:bg-[#F5F5F5]/50">
                      <td className="py-3.5 px-4 font-semibold text-[#111111]">{deal.title}</td>
                      <td className="py-3.5 px-4 text-[#555555]">{getProductName(deal.product_id)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-2 py-1 rounded text-xs font-bold">
                          {deal.discount_percent}% OFF
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-[#888888]">
                        <div className="flex items-center gap-1.5">
                          {deal.start_date} <i className="fa-solid fa-arrow-right text-[10px]"></i> {deal.end_date}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => deleteDeal(deal.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-55 transition-colors"
                          title="Delete Promotion"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
