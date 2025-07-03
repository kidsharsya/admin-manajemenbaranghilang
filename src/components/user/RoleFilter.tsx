'use client';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
}

export default function RoleFilter({ selected, setSelected }: Props) {
  return (
    <select value={selected} onChange={(e) => setSelected(e.target.value)} className="border px-3 py-1 rounded">
      <option value="">Semua Role</option>
      <option value="admin">Admin</option>
      <option value="satpam">Satpam</option>
      <option value="tamu">Tamu</option>
    </select>
  );
}
