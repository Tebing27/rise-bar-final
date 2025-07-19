// app/admin/users/page.tsx
import { supabaseAdmin } from '@/lib/supabase-admin';
import Link from 'next/link';
import { deleteUser } from '@/lib/actions/userActions';

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
  roles: Role[] | Role | null;
}

async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select(`
      id,
      name,
      email,
      created_at,
      role_id,
      roles!users_role_id_fkey (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  
  console.log('Fetched users data:', JSON.stringify(data, null, 2));
  return data as User[];
}

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="mx-auto max-w-7xl py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Laporan Pengguna Aktif</h1>
        <Link href="/admin/users/new" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            + Tambah Pengguna
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peran (Role)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Bergabung</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user: User) => {
              // Cara yang lebih eksplisit untuk mengakses role name
              let roleName = 'user';
              
              if (user.roles) {
                // Jika roles adalah array (multiple relations)
                if (Array.isArray(user.roles) && user.roles.length > 0) {
                  roleName = user.roles[0].name;
                }
                // Jika roles adalah object (single relation)
                else if (typeof user.roles === 'object' && !Array.isArray(user.roles) && user.roles.name) {
                  roleName = user.roles.name;
                }
              }

              return (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      roleName === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {roleName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center">
                      <Link href={`/admin/users/edit/${user.id}`} className="text-indigo-600 hover:text-indigo-900">
                          Edit
                      </Link>
                      <form action={deleteUser} className="ml-4">
                          <input type="hidden" name="id" value={user.id} />
                          <button type="submit" className="text-red-600 hover:text-red-900">
                              Hapus
                          </button>
                      </form>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  Tidak ada pengguna yang terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}