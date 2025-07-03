'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState, ChangeEvent, FormEvent } from 'react';
import api from '@/lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSukses: () => void;
  dataEdit?: Laporan;
  kategoriList: { id: string; nama: string }[];
  lokasiList: { id: string; nama: string }[];
}

interface Laporan {
  id_laporan: string;
  id_kategori: string;
  id_lokasi_klaim: string;
  nama_barang: string;
  jenis_laporan: 'hilang' | 'temuan';
  lokasi_kejadian: string;
  url_foto: string[]; // ← array
  deskripsi: string;
  status: string;
  waktu_laporan: { _seconds: number };
}

export default function LaporanEditModal({ isOpen, onClose, onSukses, dataEdit, kategoriList, lokasiList }: Props) {
  const [form, setForm] = useState({
    id_kategori: '',
    id_lokasi_klaim: '',
    lokasi_kejadian: '',
    nama_barang: '',
    jenis_laporan: 'hilang',
    deskripsi: '',
    status: '',
  });

  const [files, setFiles] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dataEdit && isOpen) {
      setForm({
        id_kategori: dataEdit.id_kategori,
        id_lokasi_klaim: dataEdit.id_lokasi_klaim,
        lokasi_kejadian: dataEdit.lokasi_kejadian,
        nama_barang: dataEdit.nama_barang,
        jenis_laporan: dataEdit.jenis_laporan,
        deskripsi: dataEdit.deskripsi,
        status: dataEdit.status,
      });

      // tampilkan foto lama jika ada
      setPreviewUrls(dataEdit.url_foto || []);
      setFiles(null);
    }
  }, [dataEdit, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      setFiles(fileList);
      const newPreviews = Array.from(fileList).map((file) => URL.createObjectURL(file));
      setPreviewUrls(newPreviews);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!dataEdit) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('id_kategori', form.id_kategori);
      formData.append('id_lokasi_klaim', form.id_lokasi_klaim);
      formData.append('lokasi_kejadian', form.lokasi_kejadian);
      formData.append('nama_barang', form.nama_barang);
      formData.append('jenis_laporan', form.jenis_laporan);
      formData.append('deskripsi', form.deskripsi);
      formData.append('status', form.status);

      if (files) {
        Array.from(files).forEach((file) => {
          formData.append('foto', file); // field name 'foto' (satu, backend harus siap array)
        });
      }

      await api.put(`/laporan/${dataEdit.id_laporan}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onSukses();
      onClose();
    } catch (err) {
      console.error('Gagal update laporan', err);
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
            <Dialog.Panel className="bg-white p-6 rounded-lg w-full max-w-2xl">
              <Dialog.Title className="text-lg font-semibold mb-4">Edit Laporan</Dialog.Title>

              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                {/* semua input form */}
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
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
                    <option value="">-- Status --</option>
                    <option value="proses">Proses</option>
                    <option value="cocok">Cocok</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>

                <div>
                  <label>Foto Barang (ganti jika perlu)</label>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full" />

                  {/* Preview semua foto */}
                  {previewUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {previewUrls.map((url, i) => (
                        <img key={i} src={url} alt={`Preview ${i}`} className="w-24 h-24 object-cover rounded border" />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={loading} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-60">
                    {loading ? 'Menyimpan...' : 'Update'}
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
