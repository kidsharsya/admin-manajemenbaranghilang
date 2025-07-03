'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import MainLayout from '@/components/MainLayout';

interface Pencocokan {
  id_laporan_cocok: string;
  id_laporan_hilang: string;
  id_laporan_temuan: string;
  skor_cocok: number;
  created_at: string;
  created_by: string;
}

export default function PencocokanPage() {
  const [data, setData] = useState<Pencocokan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCocokan = async () => {
      try {
        const res = await api.get('/cocok');
        setData(res.data);
      } catch (err) {
        console.error('Gagal ambil data pencocokan:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCocokan();
  }, []);

  const formatCreatedAt = (created_at: any) => {
    if (typeof created_at === 'string') {
      return new Date(created_at).toLocaleString();
    }

    if (created_at && typeof created_at._seconds === 'number') {
      return new Date(created_at._seconds * 1000).toLocaleString();
    }

    return '-';
  };

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-4">Manajemen Pencocokan Laporan</h1>

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <table className="w-full text-sm border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="border px-2 py-2">No</th>
              <th className="border px-2 py-2">Laporan Hilang</th>
              <th className="border px-2 py-2">Laporan Temuan</th>
              <th className="border px-2 py-2">Skor Cocok</th>
              <th className="border px-2 py-2">Tanggal</th>
              <th className="border px-2 py-2">Dibuat Oleh</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.id_laporan_cocok}>
                <td className="border px-2 py-1">{i + 1}</td>
                <td className="border px-2 py-1">{item.id_laporan_hilang}</td>
                <td className="border px-2 py-1">{item.id_laporan_temuan}</td>
                <td className="border px-2 py-1">{item.skor_cocok}%</td>
                <td className="border px-2 py-1">{formatCreatedAt(item.created_at)}</td>
                <td className="border px-2 py-1">{item.created_by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </MainLayout>
  );
}
