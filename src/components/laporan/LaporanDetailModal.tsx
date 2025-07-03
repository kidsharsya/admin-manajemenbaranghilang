'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: any; // data laporan
  kategoriMap?: Record<string, string>; // optional: id_kategori => nama_kategori
  lokasiMap?: Record<string, string>; // optional: id_lokasi => nama_lokasi
  userMap?: Record<string, string>;
}

export default function LaporanDetailModal({ isOpen, onClose, data, kategoriMap, lokasiMap, userMap }: Props) {
  if (!data) return null;

  const formatTanggal = (waktu: any) => {
    if (!waktu) return '-';

    // Handle format Firebase Timestamp
    if (typeof waktu === 'object' && '_seconds' in waktu) {
      const date = new Date(waktu._seconds * 1000); // convert ke milidetik
      return date.toLocaleString('id-ID', {
        dateStyle: 'long',
        timeStyle: 'short',
      });
    }

    // Handle format ISO string biasa
    const date = new Date(waktu);
    return isNaN(date.getTime())
      ? '-'
      : date.toLocaleString('id-ID', {
          dateStyle: 'long',
          timeStyle: 'short',
        });
  };

  const namaKategori = kategoriMap?.[data.id_kategori] || data.id_kategori;
  const namaLokasi = lokasiMap?.[data.id_lokasi_klaim] || data.id_lokasi_klaim;
  const namaUser = userMap?.[data.id_user] || data.id_user;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
          <Transition.Child as={Fragment}>
            <Dialog.Panel className="bg-white p-6 rounded-lg w-full max-w-2xl">
              <Dialog.Title className="text-lg font-semibold mb-4">Detail Laporan</Dialog.Title>

              <div className="space-y-2 text-sm text-gray-800">
                <div>
                  <strong>ID Laporan:</strong> {data.id_laporan}
                </div>
                <div>
                  <strong>Nama Pelapor:</strong> {namaUser}
                </div>
                <div>
                  <strong>Nama Barang:</strong> {data.nama_barang}
                </div>
                <div>
                  <strong>Jenis Laporan:</strong> {data.jenis_laporan}
                </div>
                <div>
                  <strong>Status:</strong> {data.status}
                </div>
                <div>
                  <strong>Kategori:</strong> {namaKategori}
                </div>
                <div>
                  <strong>Lokasi Klaim:</strong> {namaLokasi}
                </div>
                <div>
                  <strong>Lokasi Kejadian:</strong> {data.lokasi_kejadian}
                </div>
                <div>
                  <strong>Deskripsi:</strong> <p className="mt-1 text-gray-700">{data.deskripsi}</p>
                </div>
                <div>
                  <strong>Waktu Laporan:</strong> {formatTanggal(data.waktu_laporan)}
                </div>

                {data.url_foto?.length > 0 && (
                  <div>
                    <strong>Foto Barang:</strong>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {data.url_foto.map((url: string, idx: number) => (
                        <img key={idx} src={url} alt={`Foto ${idx + 1}`} className="w-full h-32 object-cover rounded shadow" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Tutup
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
