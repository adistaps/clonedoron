'use client';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [adminEmail, setAdminEmail] = useState('');
  const [stats, setStats] = useState({ products: 0, deals: 0, transactions: 0 });

  useEffect(() => {
    // Get admin email from supabase session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) setAdminEmail(data.session.user.email);
    });

    // Fetch quick stats
    Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('bundles').select('*', { count: 'exact', head: true }),
      supabase.from('transactions').select('*', { count: 'exact', head: true }),
    ]).then(([prodRes, bundRes, transRes]) => {
      setStats({
        products: prodRes.count || 0,
        deals: bundRes.count || 0,
        transactions: transRes.count || 0,
      });
    });
  }, []);

  const cards = [
    {
      title: 'Products Management',
      desc: 'Add, update or remove items from catalog.',
      count: stats.products,
      href: '/admin/products',
      icon: 'fa-solid fa-box text-[#7C6CFF]',
      bgColor: 'bg-[#7C6CFF]/10',
    },
    {
      title: 'Deals Management',
      desc: 'Promotions, bundles, and discount campaigns.',
      count: stats.deals,
      href: '/admin/deals',
      icon: 'fa-solid fa-tags text-[#E8784A]',
      bgColor: 'bg-[#E8784A]/10',
    },
    {
      title: 'Cashflow Transactions',
      desc: 'Track recent revenues and administrative costs.',
      count: stats.transactions,
      href: '/admin/cashflow',
      icon: 'fa-solid fa-wallet text-[#10B981]',
      bgColor: 'bg-[#10B981]/10',
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            Admin Dashboard
          </h1>
          <p className="text-[#555555] text-sm mt-1">
            Welcome back, <span className="text-[#7C6CFF] font-semibold">{adminEmail || 'Admin'}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/25 text-[#10B981] text-xs font-semibold">
          <i className="fa-solid fa-shield-halved"></i>
          System Secure
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => {
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group p-6 bg-white border border-[#E2E8F0] rounded-2xl transition-all duration-200 hover:border-[#7C6CFF] hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                  <i className={`${card.icon} text-lg`}></i>
                </div>
                <span className="text-[#888888] group-hover:text-[#7C6CFF] transition-colors">
                  <i className="fa-solid fa-arrow-up-right-from-square text-sm"></i>
                </span>
              </div>
              <h2 className="text-base font-bold text-[#111111] group-hover:text-[#7C6CFF] transition-colors">
                {card.title}
              </h2>
              <p className="text-[#555555] text-xs mt-1.5 mb-4">{card.desc}</p>
              <div className="text-xl font-bold text-[#111111]">{card.count} Items</div>
            </Link>
          );
        })}
      </div>

      {/* Quick Launch Panel */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6">
        <h3 className="text-sm font-bold text-[#111111] mb-4">Quick Operations</h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/email"
            className="flex items-center gap-2 bg-[#7C6CFF] hover:bg-[#6B5BEE] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm"
          >
            <i className="fa-solid fa-paper-plane"></i>
            Send Client Notification
          </Link>
        </div>
      </div>
    </div>
  );
}

// Re‑use the same layout component we created earlier

