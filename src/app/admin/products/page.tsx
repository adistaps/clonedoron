'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  type: string;
  category_id?: string;
  price: number;
  image_url?: string;
  description: string;
  features?: string[];
  includes?: string[];
  compatibility?: string;
  badge?: string;
  is_freebie: boolean;
  is_active: boolean;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Search & filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [type, setType] = useState('Plugin');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [compatibility, setCompatibility] = useState('');
  const [badge, setBadge] = useState('');
  const [isFreebie, setIsFreebie] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Dynamic array lists
  const [features, setFeatures] = useState<string[]>(['']);
  const [includes, setIncludes] = useState<string[]>(['']);

  const fetchData = async () => {
    setFetching(true);
    // Fetch products
    const prodRes = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (prodRes.error) console.error(prodRes.error);
    else setProducts(prodRes.data as Product[]);

    // Fetch categories
    const catRes = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
    if (catRes.error) console.error(catRes.error);
    else setCategories(catRes.data as Category[]);

    setFetching(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-generate slug from name
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

  const handleAddFeature = () => setFeatures([...features, '']);
  const handleRemoveFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));
  const handleFeatureChange = (index: number, val: string) => {
    const updated = [...features];
    updated[index] = val;
    setFeatures(updated);
  };

  const handleAddInclude = () => setIncludes([...includes, '']);
  const handleRemoveInclude = (index: number) => setIncludes(includes.filter((_, i) => i !== index));
  const handleIncludeChange = (index: number, val: string) => {
    const updated = [...includes];
    updated[index] = val;
    setIncludes(updated);
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setSku('');
    setType('Plugin');
    setCategoryId('');
    setPrice(0);
    setImageUrl('');
    setImageFile(null);
    setDescription('');
    setCompatibility('');
    setBadge('');
    setIsFreebie(false);
    setIsActive(true);
    setFeatures(['']);
    setIncludes(['']);
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

    // Upload image if selected
    const uploadedUrl = await handleUploadImage();
    if (imageFile && !uploadedUrl) {
      setLoading(false);
      return;
    }

    const payload = {
      name,
      slug,
      sku,
      type,
      category_id: categoryId || null,
      price: Number(price),
      image_url: uploadedUrl || null,
      description,
      compatibility: compatibility || null,
      badge: badge || null,
      is_freebie: isFreebie,
      is_active: isActive,
      features: features.filter(f => f.trim() !== ''),
      includes: includes.filter(i => i.trim() !== ''),
    };

    if (editingId) {
      // Update
      const { error } = await supabase.from('products').update(payload).eq('id', editingId);
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Product updated successfully!');
        resetForm();
        fetchData();
      }
    } else {
      // Insert
      const { error } = await supabase.from('products').insert([payload]);
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Product created successfully!');
        resetForm();
        fetchData();
      }
    }
    setLoading(false);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setSlug(product.slug || '');
    setSku(product.sku);
    setType(product.type || 'Plugin');
    setCategoryId(product.category_id || '');
    setPrice(product.price);
    setImageUrl(product.image_url || '');
    setImageFile(null);
    setDescription(product.description || '');
    setCompatibility(product.compatibility || '');
    setBadge(product.badge || '');
    setIsFreebie(product.is_freebie || false);
    setIsActive(product.is_active !== false);
    setFeatures(product.features && product.features.length > 0 ? product.features : ['']);
    setIncludes(product.includes && product.includes.length > 0 ? product.includes : ['']);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert(`Error deleting product: ${error.message}`);
    } else {
      setSuccessMsg('Product deleted.');
      if (editingId === id) resetForm();
      fetchData();
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? p.category_id === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            Products Management
          </h1>
          <p className="text-[#555555] text-sm mt-1">Configure individual items in catalog, compatibility tags, and media uploads.</p>
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
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>

          {errorMsg && (
            <div className="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs">
              {errorMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSave}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="Dithertone Pro"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  SKU (Unique ID)
                </label>
                <input
                  type="text"
                  placeholder="dithertone-pro"
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                  Slug (Auto-generated)
                </label>
                <input
                  type="text"
                  placeholder="dithertone-pro"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                  Type
                </label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none transition-all duration-200"
                >
                  <option value="Plugin">Plugin</option>
                  <option value="Textures">Textures</option>
                  <option value="Action Set">Action Set</option>
                  <option value="Template">Template</option>
                  <option value="Font">Font</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none transition-all duration-200"
                >
                  <option value="">Select Category...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  Price (USD)
                </label>
                <input
                  type="number"
                  placeholder="29"
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Image upload section */}
            <div>
              <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                Product Image / Cover
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

            <div>
              <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                placeholder="Product description text..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none transition-all duration-200"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                  Compatibility
                </label>
                <input
                  type="text"
                  placeholder="Adobe Photoshop CC 2020+"
                  value={compatibility}
                  onChange={e => setCompatibility(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                  Badge (Optional)
                </label>
                <input
                  type="text"
                  placeholder="NEW or BEST SELLER"
                  value={badge}
                  onChange={e => setBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Dynamic Features List */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider">
                  Features List
                </label>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="text-xs text-[#7C6CFF] hover:text-[#6B5BEE] font-semibold"
                >
                  + Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 15+ dither patterns"
                      value={feature}
                      onChange={e => handleFeatureChange(idx, e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Package Includes List */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider">
                  Package Includes
                </label>
                <button
                  type="button"
                  onClick={handleAddInclude}
                  className="text-xs text-[#7C6CFF] hover:text-[#6B5BEE] font-semibold"
                >
                  + Add Package Item
                </button>
              </div>
              <div className="space-y-2">
                {includes.map((incl, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Photoshop Plugin (.ccx)"
                      value={incl}
                      onChange={e => handleIncludeChange(idx, e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveInclude(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 items-center pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#555555]">
                <input
                  type="checkbox"
                  checked={isFreebie}
                  onChange={e => setIsFreebie(e.target.checked)}
                  className="rounded text-[#7C6CFF] focus:ring-[#7C6CFF]"
                />
                Is Freebie
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-[#555555]">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="rounded text-[#7C6CFF] focus:ring-[#7C6CFF]"
                />
                Active (Show in Store)
              </label>
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
                    {editingId ? 'Update Product' : 'Create Product'}
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

        {/* Listing & Search panel */}
        <div className="lg:col-span-7 bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-2xl">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
            <h2 className="text-sm font-bold text-[#111111]">Catalog List ({filteredProducts.length})</h2>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-48">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input
                  type="text"
                  placeholder="Search name/SKU..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {fetching ? (
            <div className="text-center py-12 text-[#888888] text-xs">
              <i className="fa-solid fa-spinner fa-spin mr-1.5 text-base text-[#7C6CFF]"></i>
              Loading store catalog...
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="text-[#888888] text-xs py-8 text-center bg-white border border-[#E2E8F0] rounded-xl border-dashed">
              No products found in the catalog. Add one or adjust your filter.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#555555] text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Info</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Price</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredProducts.map(p => {
                    const catName = categories.find(c => c.id === p.category_id)?.name || 'Unassigned';
                    return (
                      <tr key={p.id} className="text-xs text-[#555555] hover:bg-[#F5F5F5]/30">
                        <td className="py-3 px-4 font-semibold text-[#111111]">
                          <div className="flex items-center gap-3">
                            {p.image_url ? (
                              <img
                                src={p.image_url}
                                alt={p.name}
                                className="w-8 h-8 rounded-lg object-cover border border-[#E2E8F0]"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-[#E2E8F0] flex items-center justify-center text-slate-400">
                                <i className="fa-solid fa-image"></i>
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-slate-900">{p.name}</div>
                              <div className="text-[10px] text-slate-400">{p.type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[10px] text-[#888888]">{p.sku}</td>
                        <td className="py-3 px-4 font-semibold text-slate-500">{catName}</td>
                        <td className="py-3 px-4 text-right font-bold text-[#7C6CFF]">
                          {p.is_freebie ? 'FREE' : `$${p.price}`}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.is_active !== false
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                            {p.is_active !== false ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex gap-1.5 justify-center">
                            <button
                              onClick={() => handleEdit(p)}
                              className="p-1.5 rounded-lg text-[#7C6CFF] hover:bg-[#7C6CFF]/10 transition-colors"
                              title="Edit"
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
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
