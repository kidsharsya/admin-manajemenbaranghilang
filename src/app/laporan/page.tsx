'use client';
import { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import api from '@/lib/api';
import LaporanTambahModal from '@/components/laporan/LaporanTambahModal';
import LaporanEditModal from '@/components/laporan/LaporanEditModal';
import LaporanDetailModal from '@/components/laporan/LaporanDetailModal';

interface Laporan {
  id_laporan: string;
  id_user: string;
  id_kategori: string;
  id_lokasi_klaim: string;
  nama_barang: string;
  jenis_laporan: 'hilang' | 'temuan';
  lokasi_kejadian: string;
  url_foto: string[];
  deskripsi: string;
  status: string;
  waktu_laporan: { _seconds: number };
}

export default function LaporanPage() {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [jenisFilter, setJenisFilter] = useState<string>('');
  const [modalTambahOpen, setModalTambahOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [dataEdit, setDataEdit] = useState<Laporan | undefined>();
  const [modalDetailOpen, setModalDetailOpen] = useState(false);
  const [dataDetail, setDataDetail] = useState<Laporan | undefined>();
  const [kategoriList, setKategoriList] = useState<{ id_kategori: string; nama_kategori: string }[]>([]);
  const [lokasiList, setLokasiList] = useState<{ id_lokasi_klaim: string; lokasi_klaim: string }[]>([]);
  const [userList, setUserList] = useState<{ id: string; username: string }[]>([]);

  const fetchLaporan = () => {
    api
      .get('/laporan') // sesuaikan endpoint
      .then((res) => setLaporan(res.data))
      .catch((err) => console.error(err));
    api.get('/kategori').then((res) => setKategoriList(res.data));
    api.get('/lokasi').then((res) => setLokasiList(res.data));
    api.get('/users').then((res) => setUserList(res.data));
  };

  const getNamaKategori = (id_kat: string) => {
    const match = kategoriList.find((k) => k.id_kategori === id_kat);
    return match ? match.nama_kategori : '-';
  };

  const getLokasiKlaim = (id_lok: string) => {
    const match = lokasiList.find((k) => k.id_lokasi_klaim === id_lok);
    return match ? match.lokasi_klaim : '-';
  };

  const getUserName = (id_us: string) => {
    const match = userList.find((k) => k.id === id_us);
    return match ? match.username : '-';
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const handleDelete = async (id_laporan: string) => {
    if (confirm('Yakin hapus laporan ini?')) {
      try {
        await api.delete(`/laporan/${id_laporan}`);
        fetchLaporan();
      } catch (err: any) {
        console.error('Gagal hapus:', err.response?.data || err.message);
        alert('Gagal menghapus laporan. Cek console untuk detail.');
      }
    }
  };

  const convertTimestamp = (seconds: number) => {
    return new Date(seconds * 1000).toLocaleString('id-ID');
  };

  const filtered = laporan.filter((l) => {
    const matchStatus = filter ? l.status.toLowerCase() === filter.toLowerCase() : true;
    const matchJenis = jenisFilter ? l.jenis_laporan.toLowerCase() === jenisFilter.toLowerCase() : true;
    return matchStatus && matchJenis;
  });

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
        {/* Kiri: Judul + Filter */}
        <div>
          <h1 className="text-2xl font-bold mb-8">Manajemen Laporan</h1>
          <div className="flex gap-2 flex-wrap">
            <select value={jenisFilter} onChange={(e) => setJenisFilter(e.target.value)} className="border px-3 py-2 rounded text-sm">
              <option value="">Semua Jenis</option>
              <option value="hilang">Hilang</option>
              <option value="temuan">Temuan</option>
            </select>

            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border px-3 py-2 rounded text-sm">
              <option value="">Semua Status</option>
              <option value="proses">Proses</option>
              <option value="cocok">Cocok</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>

        {/* Kanan: Tombol Tambah */}
        <div className="self-end md:self-start">
          <button
            onClick={() => {
              setModalTambahOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Tambah Laporan
          </button>
        </div>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-2">Pelapor</th>
            <th className="border px-2 py-2">Kategori</th>
            <th className="border px-2 py-2">Nama Barang</th>
            <th className="border px-2 py-2">Jenis</th>
            <th className="border px-2 py-2">Lokasi Kejadian</th>
            <th className="border px-2 py-2">Foto</th>
            <th className="border px-2 py-2">Status</th>
            <th className="border px-2 py-2">Lokasi Klaim</th>
            <th className="border px-2 py-2">Waktu</th>
            <th className="border px-2 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((lap) => (
            <tr key={lap.id_laporan} className="text-center">
              <td className="border px-2 py-1">{getUserName(lap.id_user)}</td>
              <td className="border px-2 py-1">{getNamaKategori(lap.id_kategori)}</td>
              <td className="border px-2 py-1">{lap.nama_barang}</td>
              <td className="border px-2 py-1">{lap.jenis_laporan}</td>
              <td className="border px-2 py-1">{lap.lokasi_kejadian}</td>
              <td className="border px-2 py-1">{lap.url_foto?.[0] && <img src={lap.url_foto[0]} alt="Foto Barang" className="w-14 h-14 object-cover rounded" />}</td>
              <td className="border px-2 py-1 capitalize">{lap.status}</td>
              <td className="border px-2 py-1">{getLokasiKlaim(lap.id_lokasi_klaim)}</td>
              <td className="border px-2 py-1">{convertTimestamp(lap.waktu_laporan._seconds)}</td>
              <td className="border px-2 py-1 space-x-2">
                {/* Tombol-tombol aksi */}
                <button
                  onClick={() => {
                    setDataDetail(lap);
                    setModalDetailOpen(true);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Detail
                </button>

                <button
                  onClick={() => {
                    setModalEditOpen(true);
                    setDataEdit(lap);
                  }}
                  className="text-yellow-600 hover:underline"
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(lap.id_laporan)} className="text-red-600 hover:underline">
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <LaporanTambahModal
        isOpen={modalTambahOpen}
        onClose={() => setModalTambahOpen(false)}
        onSukses={fetchLaporan}
        kategoriList={kategoriList.map((k) => ({ id: k.id_kategori, nama: k.nama_kategori }))}
        lokasiList={lokasiList.map((l) => ({ id: l.id_lokasi_klaim, nama: l.lokasi_klaim }))}
      />
      <LaporanEditModal
        isOpen={modalEditOpen}
        onClose={() => setModalEditOpen(false)}
        onSukses={fetchLaporan}
        dataEdit={dataEdit}
        kategoriList={kategoriList.map((k) => ({ id: k.id_kategori, nama: k.nama_kategori }))}
        lokasiList={lokasiList.map((l) => ({ id: l.id_lokasi_klaim, nama: l.lokasi_klaim }))}
      />
      <LaporanDetailModal
        isOpen={modalDetailOpen}
        onClose={() => setModalDetailOpen(false)}
        data={dataDetail}
        kategoriMap={Object.fromEntries(kategoriList.map((k) => [k.id_kategori, k.nama_kategori]))}
        lokasiMap={Object.fromEntries(lokasiList.map((l) => [l.id_lokasi_klaim, l.lokasi_klaim]))}
        userMap={Object.fromEntries(userList.map((l) => [l.id, l.username]))}
      />
    </MainLayout>
  );
}
