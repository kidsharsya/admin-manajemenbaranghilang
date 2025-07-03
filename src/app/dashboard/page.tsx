'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import MainLayout from '@/components/MainLayout';

interface SummaryData {
  totalTamu: number;
  totalSatpam: number;
  totalAdmin: number;
  totalHilang: number;
  totalTemuan: number;
  totalCocok: number;
  totalKlaim: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [userRes, hilangRes, temuanRes, cocokRes, klaimRes] = await Promise.all([
          api.get('/users'), // semua user
          api.get('/laporan?jenis_laporan=hilang'),
          api.get('/laporan?jenis_laporan=temuan'),
          api.get('/cocok'),
          api.get('/klaim'),
        ]);

        const users = userRes.data;
        const totalTamu = users.filter((u: any) => u.role === 'tamu').length;
        const totalSatpam = users.filter((u: any) => u.role === 'satpam').length;
        const totalAdmin = users.filter((u: any) => u.role === 'admin').length;

        setData({
          totalTamu,
          totalSatpam,
          totalAdmin,
          totalHilang: hilangRes.data.length,
          totalTemuan: temuanRes.data.length,
          totalCocok: cocokRes.data.length,
          totalKlaim: klaimRes.data.length,
        });
      } catch (err) {
        console.error('Gagal memuat data ringkasan dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Tamu" value={data?.totalTamu} color="bg-blue-100" text="text-blue-700" />
          <StatCard title="Total Satpam" value={data?.totalSatpam} color="bg-yellow-100" text="text-yellow-700" />
          <StatCard title="Total Admin" value={data?.totalAdmin} color="bg-green-100" text="text-green-700" />
          <StatCard title="Laporan Hilang" value={data?.totalHilang} color="bg-red-100" text="text-red-700" />
          <StatCard title="Laporan Temuan" value={data?.totalTemuan} color="bg-purple-100" text="text-purple-700" />
          <StatCard title="Jumlah Pencocokan" value={data?.totalCocok} color="bg-indigo-100" text="text-indigo-700" />
          <StatCard title="Jumlah Klaim" value={data?.totalKlaim} color="bg-teal-100" text="text-teal-700" />
        </div>
      )}
    </MainLayout>
  );
}

function StatCard({ title, value, color, text }: { title: string; value?: number; color: string; text: string }) {
  return (
    <div className={`rounded-xl p-5 shadow-md ${color}`}>
      <p className={`text-sm font-semibold mb-2 ${text}`}>{title}</p>
      <p className={`text-3xl font-bold ${text}`}>{value ?? 0}</p>
    </div>
  );
}
