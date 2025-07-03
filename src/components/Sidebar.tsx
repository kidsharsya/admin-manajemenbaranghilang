'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, FolderOpen, MapPin, LogOut, Search, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/user', label: 'User', icon: Users },
  { href: '/laporan', label: 'Laporan', icon: FileText },
  { href: '/kategori', label: 'Kategori', icon: FolderOpen },
  { href: '/lokasi', label: 'Lokasi', icon: MapPin },
  { href: '/cocok', label: 'Pencocokan', icon: Settings },
  { href: '/klaim', label: 'Klaim Satpam', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-slate-900 to-slate-800 text-white h-screen shadow-2xl flex flex-col transition-all duration-300 ease-in-out border-r border-slate-700`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-xl font-bold text-white">Admin Panel</h2>
              <p className="text-sm text-slate-300 mt-1">Manajemen Barang Hilang</p>
            </div>
          )}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
            >
              <Icon size={20} className={`${isCollapsed ? 'mx-auto' : 'mr-3'} ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              {!isCollapsed && <span className="font-medium">{link.label}</span>}
              {isActive && !isCollapsed && <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
