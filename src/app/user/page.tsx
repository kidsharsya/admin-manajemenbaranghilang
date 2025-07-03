'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import api from '@/lib/api';
import UserTambahModal from '@/components/user/UserTambahModal';
import UserEditModal from '@/components/user/UserEditModal';
import RoleFilter from '@/components/user/RoleFilter';

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'tamu' | 'satpam' | 'admin';
  url_foto_identitas?: string;
  created_at?: string;
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [modalTambahOpen, setModalTambahOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [dataEdit, setDataEdit] = useState<User | undefined>(undefined);
  const [roleFilter, setRoleFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Gagal ambil data user:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin hapus user ini?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (err: any) {
        console.error('Gagal hapus:', err.response?.data || err.message);
        alert('Gagal menghapus user.');
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchRole = roleFilter ? user.role === roleFilter : true;
    const matchSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchSearch;
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
        <button onClick={() => setModalTambahOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Tambah User
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input type="text" placeholder="Cari username..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border px-3 py-1 rounded w-full max-w-sm" />
        <RoleFilter selected={roleFilter} setSelected={setRoleFilter} />
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-2">Username</th>
            <th className="border px-2 py-2">Email</th>
            <th className="border px-2 py-2">Role</th>
            <th className="border px-2 py-2">Foto Identitas</th>
            <th className="border px-2 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="border px-2 py-1">{user.username}</td>
              <td className="border px-2 py-1">{user.email}</td>
              <td className="border px-2 py-1 capitalize">{user.role}</td>
              <td className="border px-2 py-1">
                {user.url_foto_identitas ? <img src={user.url_foto_identitas} alt="Foto Identitas" className="w-12 h-12 object-cover rounded mx-auto" /> : <span className="text-gray-400 italic">Tidak ada</span>}
              </td>
              <td className="border px-2 py-1 space-x-2">
                <button
                  onClick={() => {
                    setDataEdit(user);
                    setModalEditOpen(true);
                  }}
                  className="text-yellow-600 hover:underline"
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline">
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <UserTambahModal isOpen={modalTambahOpen} onClose={() => setModalTambahOpen(false)} onSukses={fetchUsers} />
      <UserEditModal isOpen={modalEditOpen} onClose={() => setModalEditOpen(false)} onSukses={fetchUsers} dataEdit={dataEdit} />
    </MainLayout>
  );
}
