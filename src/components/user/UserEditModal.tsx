'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState, ChangeEvent, FormEvent } from 'react';
import api from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'tamu' | 'satpam' | 'admin';
  url_foto_identitas?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSukses: () => void;
  dataEdit?: User;
}

export default function UserEditModal({ isOpen, onClose, onSukses, dataEdit }: Props) {
  const [form, setForm] = useState<User>({
    id: '',
    username: '',
    email: '',
    password: '',
    role: 'tamu',
    url_foto_identitas: '',
  });

  const [fotoBaru, setFotoBaru] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dataEdit) {
      setForm({
        id: dataEdit.id,
        username: dataEdit.username,
        email: dataEdit.email,
        password: '', // kosongkan untuk keamanan, user bisa ganti jika mau
        role: dataEdit.role,
        url_foto_identitas: dataEdit.url_foto_identitas || '',
      });
      setPreviewUrl(dataEdit.url_foto_identitas || '');
      setFotoBaru(null);
    }
  }, [dataEdit]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoBaru(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', form.username);
      formData.append('email', form.email);
      formData.append('role', form.role);
      if (form.password) {
        formData.append('password', form.password); // hanya dikirim jika ada
      }
      if (fotoBaru) {
        formData.append('foto_identitas', fotoBaru);
      }

      await api.put(`/users/${form.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onSukses();
      onClose();
    } catch (err) {
      console.error('Gagal update user:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!dataEdit) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
          <Transition.Child as={Fragment}>
            <Dialog.Panel className="bg-white p-6 rounded-lg w-full max-w-md">
              <Dialog.Title className="text-lg font-semibold mb-4">Edit Pengguna</Dialog.Title>

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
                  <label>Password (kosongkan jika tidak ingin diganti)</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
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
                  <label>Ganti Foto Identitas</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
                  {previewUrl && <img src={previewUrl} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded border" />}
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={loading} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-60">
                    {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
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
