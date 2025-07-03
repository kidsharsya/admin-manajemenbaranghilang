'use client';
import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import KategoriModal from '@/components/kategori/KategoriModal';
import api from '@/lib/api';

interface Kategori {
  id_kategori: number;
  nama_kategori: string;
}

export default function KategoriPage() {
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'tambah' | 'edit'>('tambah');
  const [dataEdit, setDataEdit] = useState<Kategori | undefined>();

  const fetchKategori = () => {
    api
      .get('/kategori')
      .then((res) => setKategori(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  const handleDelete = async (id_kategori: number) => {
    if (confirm('Yakin ingin menghapus?')) {
      await api.delete(`/kategori/${id_kategori}`);
      fetchKategori();
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manajemen Kategori</h1>
        <button
          onClick={() => {
            setModalMode('tambah');
            setDataEdit(undefined);
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Tambah Kategori
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nama Kategori</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {kategori.map((item) => (
            <tr key={item.id_kategori} className="text-center">
              <td className="border px-4 py-2">{item.id_kategori}</td>
              <td className="border px-4 py-2">{item.nama_kategori}</td>
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
                <button onClick={() => handleDelete(item.id_kategori)} className="text-red-600 hover:underline">
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Tambah/Edit */}
      <KategoriModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSukses={fetchKategori} mode={modalMode} dataEdit={dataEdit} />
    </MainLayout>
  );
}
