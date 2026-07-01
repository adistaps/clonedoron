'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  description?: string;
}

export default function CashflowPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [form, setForm] = useState<Partial<Transaction>>({
    amount: 0,
    type: 'income',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) console.error('Error fetching transactions', error);
    else setTransactions(data as Transaction[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('transactions').insert([form]);
    if (error) {
      alert(`Error creating transaction: ${error.message}`);
    } else {
      setForm({
        amount: 0,
        type: 'income',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
      fetchTransactions();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction record?')) return;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) console.error('Delete error', error);
    else fetchTransactions();
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const net = totalIncome - totalExpense;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
          Cashflow Overview
        </h1>
        <p className="text-[#555555] text-sm mt-1">Track accounting entries, administrative costs, and purchase receipts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#10B981]/5 border border-[#10B981]/20 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[#555555] text-xs font-bold uppercase tracking-wider">Total Income</span>
            <i className="fa-solid fa-arrow-trend-up text-[#10B981]"></i>
          </div>
          <p className="text-2xl font-bold text-[#10B981]">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[#555555] text-xs font-bold uppercase tracking-wider">Total Expense</span>
            <i className="fa-solid fa-arrow-trend-down text-rose-600"></i>
          </div>
          <p className="text-2xl font-bold text-rose-600">${totalExpense.toLocaleString()}</p>
        </div>
        <div className={`border p-6 rounded-2xl ${net >= 0 ? 'bg-[#7C6CFF]/5 border-[#7C6CFF]/20' : 'bg-rose-50 border-rose-200'}`}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[#555555] text-xs font-bold uppercase tracking-wider">Net Balance</span>
            <i className={`fa-solid fa-dollar-sign ${net >= 0 ? 'text-[#7C6CFF]' : 'text-rose-600'}`}></i>
          </div>
          <p className={`text-2xl font-bold ${net >= 0 ? 'text-[#7C6CFF]' : 'text-rose-600'}`}>
            ${net.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creation panel */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-2xl h-fit">
          <h2 className="text-sm font-bold text-[#111111] mb-5 flex items-center gap-2">
            <i className="fa-solid fa-plus text-[#7C6CFF]"></i>
            Add Transaction Entry
          </h2>
          <form className="space-y-4" onSubmit={handleCreate}>
            <div>
              <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                Transaction Type
              </label>
              <select
                name="type"
                value={form.type || 'income'}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-sm focus:outline-none transition-all duration-200"
                required
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-dollar-sign text-[#888888]"></i> Amount (USD)
              </label>
              <input
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-sm focus:outline-none transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-calendar text-[#888888]"></i> Transaction Date
              </label>
              <input
                name="date"
                type="date"
                value={form.date || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-sm focus:outline-none transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-file-invoice text-[#888888]"></i> Description
              </label>
              <textarea
                name="description"
                placeholder="Client payout or web hosting..."
                value={form.description || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-sm focus:outline-none transition-all duration-200"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#7C6CFF] hover:bg-[#6B5BEE] text-white py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {submitting ? 'Adding...' : 'Log Transaction'}
            </button>
          </form>
        </div>

        {/* List panel */}
        <div className="lg:col-span-2 bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-2xl">
          <h2 className="text-sm font-bold text-[#111111] mb-5">Transaction History</h2>
          {loading ? (
            <p className="text-[#888888] text-sm">Loading histories...</p>
          ) : transactions.length === 0 ? (
            <p className="text-[#888888] text-sm">No transaction entries found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#555555] text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {transactions.map(t => (
                    <tr key={t.id} className="text-sm text-[#555555] hover:bg-[#F5F5F5]/50">
                      <td className="py-3.5 px-4 font-mono text-xs text-[#888888]">{t.date}</td>
                      <td className="py-3.5 px-4 font-semibold text-[#111111]">{t.description || 'No Description'}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          t.type === 'income'
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-600'
                            : 'bg-rose-50 border border-rose-200 text-rose-600'
                        }`}>
                          {t.type.toUpperCase()}
                        </span>
                      </td>
                      <td className={`py-3.5 px-4 text-right font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        ${Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-55 transition-colors"
                          title="Delete Record"
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
