'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import api from '@/lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSukses: () => void;
  mode: 'tambah' | 'edit';
  dataEdit?: {
    id_lokasi_klaim: number;
    lokasi_klaim: string;
  };
}

export default function LokasiModal({ isOpen, onClose, onSukses, mode, dataEdit }: Props) {
  const [lokasi_klaim, setLokasi] = useState('');

  useEffect(() => {
    if (mode === 'edit' && dataEdit) {
      setLokasi(dataEdit.lokasi_klaim);
    } else {
      setLokasi('');
    }
  }, [mode, dataEdit, isOpen]);

  const handleSubmit = async () => {
    try {
      if (mode === 'tambah') {
        await api.post('/lokasi', { lokasi_klaim });
      } else {
        await api.put(`/lokasi/${dataEdit?.id_lokasi_klaim}`, { lokasi_klaim });
      }
      onSukses();
      onClose();
    } catch (err) {
      console.error('Gagal simpan kategori:', err);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={onClose} className="relative z-50">
        <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="scale-95 opacity-0" enterTo="scale-100 opacity-100" leave="ease-in duration-150" leaveFrom="scale-100 opacity-100" leaveTo="scale-95 opacity-0">
            <Dialog.Panel className="bg-white rounded-lg shadow p-6 w-full max-w-md">
              <Dialog.Title className="text-xl font-bold mb-4">{mode === 'tambah' ? 'Tambah Lokasi' : 'Edit Lokasi'}</Dialog.Title>

              <div className="space-y-4">
                <input type="text" placeholder="Lokasi" className="w-full border px-3 py-2 rounded" value={lokasi_klaim} onChange={(e) => setLokasi(e.target.value)} />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                  Batal
                </button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Simpan
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
