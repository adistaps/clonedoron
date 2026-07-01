'use client';

import '@/app/globals.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin/login');
  };

  const isLoginPage = pathname === '/admin/login' || pathname === '/login';

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100 font-poppins">
        {children}
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: 'fa-solid fa-chart-line' },
    { name: 'Homepage CMS', href: '/admin/homepage', icon: 'fa-solid fa-house-chimney' },
    { name: 'Products', href: '/admin/products', icon: 'fa-solid fa-box' },
    { name: 'Categories', href: '/admin/categories', icon: 'fa-solid fa-sitemap' },
    { name: 'Bundles (Deals)', href: '/admin/bundles', icon: 'fa-solid fa-layer-group' },
    { name: 'Cashflow', href: '/admin/cashflow', icon: 'fa-solid fa-wallet' },
    { name: 'Email Sender', href: '/admin/email', icon: 'fa-solid fa-paper-plane' },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#111111] font-poppins">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between">
        <div>
          {/* Logo Section */}
          <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between">
            <span className="text-lg font-bold tracking-tight text-[#111111] flex items-center gap-2">
              <i className="fa-solid fa-circle-nodes text-[#7C6CFF]"></i>
              Tassofly CMS
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#7C6CFF]/10 text-[#7C6CFF] border border-[#7C6CFF]/20 shadow-sm'
                      : 'text-[#555555] hover:bg-[#F5F5F5] hover:text-[#111111] border border-transparent'
                  }`}
                >
                  <i className={`${item.icon} w-5 text-center text-[15px]`}></i>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-[#F1F5F9]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all duration-200"
          >
            <i className="fa-solid fa-right-from-bracket w-5 text-center text-[15px]"></i>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm">
          {children}
        </div>
      </main>
    </div>
  );
}
