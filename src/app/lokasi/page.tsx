'use client';
import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import api from '@/lib/api';
import LokasiModal from '@/components/lokasi/LokasiModal';

interface Lokasi {
  id_lokasi_klaim: number;
  lokasi_klaim: string;
}

export default function LokasiPage() {
  const [kategori, setKategori] = useState<Lokasi[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'tambah' | 'edit'>('tambah');
  const [dataEdit, setDataEdit] = useState<Lokasi | undefined>();

  const fetchKategori = () => {
    api
      .get('/lokasi')
      .then((res) => setKategori(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  const handleDelete = async (id_lokasi_klaim: number) => {
    if (confirm('Yakin ingin menghapus?')) {
      await api.delete(`/lokasi/${id_lokasi_klaim}`);
      fetchKategori();
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manajemen Lokasi</h1>
        <button
          onClick={() => {
            setModalMode('tambah');
            setDataEdit(undefined);
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Tambah Lokasi
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Lokasi</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {kategori.map((item) => (
            <tr key={item.id_lokasi_klaim} className="text-center">
              <td className="border px-4 py-2">{item.id_lokasi_klaim}</td>
              <td className="border px-4 py-2">{item.lokasi_klaim}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => {
                    setModalMode('edit');
                    setDataEdit(item);
                    setModalOpen(true);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id_lokasi_klaim)} className="text-red-600 hover:underline">
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Tambah/Edit */}
      <LokasiModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSukses={fetchKategori} mode={modalMode} dataEdit={dataEdit} />
    </MainLayout>
  );
}
