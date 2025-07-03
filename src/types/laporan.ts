export interface Laporan {
  id_laporan: string;
  id_kategori: string;
  id_user: string;
  id_lokasi_klaim: string;
  lokasi_kejadian: string;
  nama_barang: string;
  jenis_laporan: 'hilang' | 'temuan';
  url_foto: string[]; // bisa banyak
  deskripsi: string;
  waktu_laporan: {
    _seconds: number;
    _nanoseconds: number;
  };
  status: 'proses' | 'cocok' | 'selesai';
}
