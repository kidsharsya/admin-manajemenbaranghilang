export interface User {
  id: number;
  username: string;
  email: string;
  url_foto_identitas: string;
  role: 'admin' | 'satpam' | 'tamu';
  created_at: string;
}
