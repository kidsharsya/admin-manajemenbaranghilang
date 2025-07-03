'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, ChangeEvent, FormEvent } from 'react';
import api from '@/lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSukses: () => void;
}

export default function UserTambahModal({ isOpen, onClose, onSukses }: Props) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'tamu',
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFoto(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', form.username);
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('role', form.role);
      if (foto) {
        formData.append('foto_identitas', foto); // Sesuaikan key ini dengan backend
      }

      await api.post('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onSukses();
      onClose();
    } catch (err) {
      console.error('Gagal tambah user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
          <Transition.Child as={Fragment}>
            <Dialog.Panel className="bg-white p-6 rounded-lg w-full max-w-md">
              <Dialog.Title className="text-lg font-semibold mb-4">Tambah Pengguna</Dialog.Title>

              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div>
                  <label>Username</label>
                  <input name="username" value={form.username} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
                </div>

                <div>
                  <label>Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
                </div>

                <div>
                  <label>Password</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
                </div>

                <div>
                  <label>Role</label>
                  <select name="role" value={form.role} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                    <option value="tamu">Tamu</option>
                    <option value="satpam">Satpam</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label>Foto Identitas</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60">
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
