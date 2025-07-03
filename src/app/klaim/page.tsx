'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import MainLayout from '@/components/MainLayout';

interface Klaim {
  id_klaim: string;
  id_laporan_cocok: string;
  id_satpam: string;
  id_penerima: string;
  url_foto_klaim: string;
  waktu_terima: string;
  status: string;
}

export default function KlaimPage() {
  const [data, setData] = useState<Klaim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKlaim = async () => {
      try {
        const res = await api.get('/klaim');
        setData(res.data);
      } catch (err) {
        console.error('Gagal ambil data klaim:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchKlaim();
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
      <h1 className="text-2xl font-bold mb-4">Manajemen Klaim</h1>

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="border px-2 py-2">ID Klaim</th>
                <th className="border px-2 py-2">ID Laporan Cocok</th>
                <th className="border px-2 py-2">ID Satpam</th>
                <th className="border px-2 py-2">ID Penerima</th>
                <th className="border px-2 py-2">Foto Klaim</th>
                <th className="border px-2 py-2">Waktu Terima</th>
                <th className="border px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id_klaim}>
                  <td className="border px-2 py-1">{item.id_klaim}</td>
                  <td className="border px-2 py-1">{item.id_laporan_cocok}</td>
                  <td className="border px-2 py-1">{item.id_satpam}</td>
                  <td className="border px-2 py-1">{item.id_penerima}</td>
                  <td className="border px-2 py-1">
                    <a href={item.url_foto_klaim} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      Lihat Foto
                    </a>
                  </td>
                  <td className="border px-2 py-1">{formatCreatedAt(item.waktu_terima)}</td>
                  <td className="border px-2 py-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'selesai' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MainLayout>
  );
}
