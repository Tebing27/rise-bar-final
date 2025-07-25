// app/admin/users/page.tsx
import { supabaseAdmin } from '@/lib/supabase-admin';
import Link from 'next/link';
import { deleteUser } from '@/lib/actions/userActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Search } from '@/components/admin/Search'; // <-- Impor Search

export const dynamic = 'force-dynamic';

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
  role_id: string;
  roles: Role | null;
}

// ✅ Fungsi diupdate untuk menerima query pencarian
async function getAllUsers(searchQuery: string): Promise<User[]> {
  let query = supabaseAdmin
    .from('users')
    .select('*, roles ( id, name )')
    .order('created_at', { ascending: false });

  // Jika ada query pencarian, filter berdasarkan nama atau email
  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  return data as User[];
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams?.query || '';
  const users = await getAllUsers(searchQuery);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <CardTitle>Laporan Pengguna Aktif</CardTitle>
            <CardDescription>Kelola semua pengguna terdaftar di platform.</CardDescription>
          </div>
          {/* ✅ Search bar ditambahkan di sini */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Search placeholder="Cari nama/email..." />
            <Link href="/admin/users/new">
              <Button className="w-full sm:w-auto">+ Tambah Pengguna</Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* ... sisa komponen tidak berubah ... */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead className="hidden lg:table-cell">Tanggal Bergabung</TableHead>
                <TableHead>
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name || '-'}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                  <TableCell>
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.roles?.name === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.roles?.name || 'user'}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/admin/users/edit/${user.id}`}>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                        </Link>
                        <form action={deleteUser}>
                          <input type="hidden" name="id" value={user.id} />
                          <button type="submit" className="w-full">
                            <DropdownMenuItem className="text-destructive">Hapus</DropdownMenuItem>
                          </button>
                        </form>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Tidak ada pengguna yang cocok.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}