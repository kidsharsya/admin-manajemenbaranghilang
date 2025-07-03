'use client';
import { logout } from '@/lib/auth';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';

export default function Topbar() {
  const { user } = useContext(UserContext);

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-end items-center gap-4 border-b border-gray-300">
      <div className="flex items-center gap-3">
        {user?.url_foto_identitas ? (
          <img src={user.url_foto_identitas} alt="Foto Profil" className="w-9 h-9 rounded-full object-cover border border-gray-300" />
        ) : (
          <div className="bg-blue-600 text-white rounded-full w-9 h-9 flex items-center justify-center font-semibold uppercase">{user?.username?.charAt(0) || 'A'}</div>
        )}
        <span className="text-sm font-bold text-gray-700">{user?.username || ''}</span>
      </div>
      <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-2xl transition">
        Logout
      </button>
    </header>
  );
}
