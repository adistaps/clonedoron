'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

type Product = {
  id: string;
  name: string;
};

type Bundle = {
  id: string;
  slug: string;
  name: string;
  color?: string;
  save_amount: number;
  image_url?: string;
  is_active: boolean;
};

type BundleProductRelation = {
  bundle_id: string;
  product_id: string;
};

export default function BundlesCRUDPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [relations, setRelations] = useState<BundleProductRelation[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form inputs
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [color, setColor] = useState('#A3A3A3');
  const [saveAmount, setSaveAmount] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const loadData = async () => {
    setFetching(true);
    const [bundRes, prodRes, relRes] = await Promise.all([
      supabase.from('bundles').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('id, name'),
      supabase.from('bundle_products').select('bundle_id, product_id')
    ]);

    if (bundRes.data) setBundles(bundRes.data as Bundle[]);
    if (prodRes.data) setProducts(prodRes.data as Product[]);
    if (relRes.data) setRelations(relRes.data as BundleProductRelation[]);

    setFetching(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Generate slug dynamically
  useEffect(() => {
    if (!editingId && name) {
      setSlug(
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  }, [name, editingId]);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setColor('#A3A3A3');
    setSaveAmount(0);
    setImageUrl('');
    setImageFile(null);
    setIsActive(true);
    setSelectedProductIds([]);
    setErrorMsg('');
  };

  const handleUploadImage = async (): Promise<string | null> => {
    if (!imageFile) return imageUrl || null;

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }
      return data.url;
    } catch (err: any) {
      setErrorMsg(err.message || 'Image upload failed.');
      return null;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const uploadedUrl = await handleUploadImage();
    if (imageFile && !uploadedUrl) {
      setLoading(false);
      return;
    }

    const payload = {
      name,
      slug,
      color,
      save_amount: Number(saveAmount),
      image_url: uploadedUrl || null,
      is_active: isActive,
    };

    let bundleId = editingId;

    if (editingId) {
      // Update Bundle info
      const { error: bundErr } = await supabase.from('bundles').update(payload).eq('id', editingId);
      if (bundErr) {
        setErrorMsg(bundErr.message);
        setLoading(false);
        return;
      }
    } else {
      // Insert Bundle
      const { data: newBund, error: bundErr } = await supabase.from('bundles').insert([payload]).select('id').single();
      if (bundErr) {
        setErrorMsg(bundErr.message);
        setLoading(false);
        return;
      }
      bundleId = newBund.id;
    }

    if (bundleId) {
      // Refresh relations
      // 1. Delete existing connections
      await supabase.from('bundle_products').delete().eq('bundle_id', bundleId);

      // 2. Insert new connections
      if (selectedProductIds.length > 0) {
        const inserts = selectedProductIds.map((pid, idx) => ({
          bundle_id: bundleId,
          product_id: pid,
          sort_order: idx
        }));
        const { error: relErr } = await supabase.from('bundle_products').insert(inserts);
        if (relErr) {
          setErrorMsg(relErr.message);
          setLoading(false);
          return;
        }
      }
    }

    setSuccessMsg(editingId ? 'Bundle updated successfully!' : 'Bundle created successfully!');
    resetForm();
    loadData();
    setLoading(false);
  };

  const handleEdit = (bundle: Bundle) => {
    setEditingId(bundle.id);
    setName(bundle.name);
    setSlug(bundle.slug);
    setColor(bundle.color || '#A3A3A3');
    setSaveAmount(bundle.save_amount);
    setImageUrl(bundle.image_url || '');
    setImageFile(null);
    setIsActive(bundle.is_active !== false);

    // Load selected product ids
    const activeProductIds = relations
      .filter(r => r.bundle_id === bundle.id)
      .map(r => r.product_id);
    setSelectedProductIds(activeProductIds);

    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bundle?')) return;
    const { error } = await supabase.from('bundles').delete().eq('id', id);
    if (error) {
      alert(`Error deleting bundle: ${error.message}`);
    } else {
      setSuccessMsg('Bundle deleted.');
      if (editingId === id) resetForm();
      loadData();
    }
  };

  const handleToggleProduct = (pid: string) => {
    if (selectedProductIds.includes(pid)) {
      setSelectedProductIds(selectedProductIds.filter(id => id !== pid));
    } else {
      setSelectedProductIds([...selectedProductIds, pid]);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            Bundles CRUD
          </h1>
          <p className="text-[#555555] text-sm mt-1">Configure preset bundles, save percentages, background coloring, and catalog content.</p>
        </div>
        {successMsg && (
          <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold">
            <i className="fa-solid fa-check mr-1.5"></i>
            {successMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Creation/Edit Form */}
        <div className="lg:col-span-5 bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-2xl h-fit">
          <h2 className="text-sm font-bold text-[#111111] mb-5 flex items-center gap-2">
            <i className={`fa-solid ${editingId ? 'fa-pen-to-square text-[#7C6CFF]' : 'fa-plus text-[#7C6CFF]'}`}></i>
            {editingId ? 'Edit Bundle' : 'Create New Bundle'}
          </h2>

          {errorMsg && (
            <div className="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs">
              {errorMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSave}>
            <div>
              <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                Bundle Name
              </label>
              <input
                type="text"
                placeholder="Merchandise Master Kit"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                  Slug
                </label>
                <input
                  type="text"
                  placeholder="merchandise-master-kit"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                  Save Amount ($ USD)
                </label>
                <input
                  type="number"
                  placeholder="65"
                  value={saveAmount}
                  onChange={e => setSaveAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                  Card Theme Hex Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="w-10 h-10 border border-[#E2E8F0] rounded-xl cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="rounded text-[#7C6CFF] focus:ring-[#7C6CFF]"
                  />
                  <span className="text-xs font-semibold text-[#555555]">Active Bundle</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                Bundle Cover Image
              </label>
              <div className="flex gap-4 items-center">
                {imageUrl && !imageFile && (
                  <img
                    src={imageUrl}
                    alt="Current preview"
                    className="w-16 h-16 object-cover rounded-xl border border-[#E2E8F0]"
                  />
                )}
                {imageFile && (
                  <div className="w-16 h-16 object-cover rounded-xl border border-[#7C6CFF] flex items-center justify-center bg-slate-50 text-[10px] text-[#7C6CFF] font-semibold text-center p-1">
                    Image Selected
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                      }
                    }}
                    className="block w-full text-xs text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-xl file:border-0
                      file:text-xs file:font-semibold
                      file:bg-[#7C6CFF]/10 file:text-[#7C6CFF]
                      hover:file:bg-[#7C6CFF]/20"
                  />
                </div>
              </div>
            </div>

            {/* Select bundle products list */}
            <div>
              <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-2">
                Select Bundle Products ({selectedProductIds.length})
              </label>
              <div className="max-h-56 overflow-y-auto border border-[#E2E8F0] rounded-xl bg-white p-3 space-y-2">
                {products.length === 0 ? (
                  <div className="text-center py-4 text-[#888888] text-xs">No products in store catalog</div>
                ) : (
                  products.map(p => {
                    const isChecked = selectedProductIds.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className="flex items-center gap-3 px-3 py-2 border border-[#F1F5F9] rounded-lg text-xs hover:bg-[#F8FAFC] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleProduct(p.id)}
                          className="rounded text-[#7C6CFF] focus:ring-[#7C6CFF]"
                        />
                        <span className="font-semibold text-slate-800">{p.name}</span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#7C6CFF] hover:bg-[#6B5BEE] text-white py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-xs"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk"></i>
                    {editingId ? 'Update Bundle' : 'Create Bundle'}
                  </>
                )}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 bg-slate-100 hover:bg-slate-200 text-[#555555] py-2.5 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Listing Panel */}
        <div className="lg:col-span-7 bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-2xl">
          <h2 className="text-sm font-bold text-[#111111] mb-5">Bundle Catalog List ({bundles.length})</h2>

          {fetching ? (
            <div className="text-center py-12 text-[#888888] text-xs">
              <i className="fa-solid fa-spinner fa-spin mr-1.5 text-base text-[#7C6CFF]"></i>
              Loading bundles...
            </div>
          ) : bundles.length === 0 ? (
            <p className="text-[#888888] text-xs py-8 text-center bg-white border border-[#E2E8F0] rounded-xl border-dashed">
              No bundles created yet. Use the form to make your first bundle.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#555555] text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Info</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4 text-center">Products Count</th>
                    <th className="py-3 px-4 text-right">Save Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {bundles.map(b => {
                    const bundleProductsCount = relations.filter(r => r.bundle_id === b.id).length;
                    return (
                      <tr key={b.id} className="text-xs text-[#555555] hover:bg-[#F5F5F5]/30">
                        <td className="py-3.5 px-4 font-semibold text-[#111111]">
                          <div className="flex items-center gap-3">
                            {b.image_url ? (
                              <img
                                src={b.image_url}
                                alt={b.name}
                                className="w-8 h-8 rounded-lg object-cover border border-[#E2E8F0]"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-[#E2E8F0] flex items-center justify-center text-slate-400">
                                <i className="fa-solid fa-cubes"></i>
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-slate-900">{b.name}</div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-slate-300"
                                  style={{ backgroundColor: b.color || '#A3A3A3' }}
                                />
                                <span className="text-[10px] text-slate-400 uppercase font-bold">{b.color || '#A3A3A3'}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[10px] text-[#888888]">{b.slug}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700">{bundleProductsCount} Items</td>
                        <td className="py-3.5 px-4 text-right font-bold text-[#E8784A]">Save ${b.save_amount}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.is_active !== false
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}>
                            {b.is_active !== false ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex gap-1.5 justify-center">
                            <button
                              onClick={() => handleEdit(b)}
                              className="p-1.5 rounded-lg text-[#7C6CFF] hover:bg-[#7C6CFF]/10 transition-colors"
                              title="Edit"
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(b.id)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
