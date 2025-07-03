'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import api from '@/lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSukses: () => void;
  kategoriList?: { id: string; nama: string }[];
  lokasiList?: { id: string; nama: string }[];
}

export default function LaporanTambahModal({ isOpen, onClose, onSukses, kategoriList = [], lokasiList = [] }: Props) {
  const [form, setForm] = useState({
    id_kategori: '',
    id_lokasi_klaim: '',
    lokasi_kejadian: '',
    nama_barang: '',
    jenis_laporan: 'hilang',
    deskripsi: '',
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('id_kategori', form.id_kategori);
      formData.append('id_lokasi_klaim', form.id_lokasi_klaim);
      formData.append('lokasi_kejadian', form.lokasi_kejadian);
      formData.append('nama_barang', form.nama_barang);
      formData.append('jenis_laporan', form.jenis_laporan);
      formData.append('deskripsi', form.deskripsi);

      if (files) {
        Array.from(files).forEach((file) => {
          formData.append('foto', file); // backend terima multiple 'foto'
        });
      }

      await api.post('/laporan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onSukses();
      onClose();
    } catch (err) {
      console.error('Gagal tambah laporan', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setForm({
        id_kategori: '',
        id_lokasi_klaim: '',
        lokasi_kejadian: '',
        nama_barang: '',
        jenis_laporan: 'hilang',
        deskripsi: '',
      });
      setFiles(null);
    }
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
          <Transition.Child as={Fragment}>
            <Dialog.Panel className="bg-white p-6 rounded-lg w-full max-w-2xl">
              <Dialog.Title className="text-lg font-semibold mb-4">Tambah Laporan</Dialog.Title>

              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div>
                  <label>Kategori</label>
                  <select name="id_kategori" value={form.id_kategori} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
                    <option value="">-- Pilih Kategori --</option>
                    {kategoriList.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Lokasi Klaim</label>
                  <select name="id_lokasi_klaim" value={form.id_lokasi_klaim} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                    <option value="">-- Pilih Lokasi --</option>
                    {lokasiList.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Lokasi Kejadian</label>
                  <input name="lokasi_kejadian" value={form.lokasi_kejadian} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
                </div>

                <div>
                  <label>Nama Barang</label>
                  <input name="nama_barang" value={form.nama_barang} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
                </div>

                <div>
                  <label>Jenis Laporan</label>
                  <select name="jenis_laporan" value={form.jenis_laporan} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                    <option value="hilang">Hilang</option>
                    <option value="temuan">Temuan</option>
                  </select>
                </div>

                <div>
                  <label>Deskripsi</label>
                  <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} rows={3} required className="w-full border px-3 py-2 rounded" />
                </div>

                <div>
                  <label>Foto Barang</label>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full" />
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
