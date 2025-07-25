// app/admin/page.tsx
import { StatCard } from '@/components/admin/StatCard';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Users, FileText, MessageSquareQuote } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

async function getStats() {
  const { count: users } = await supabaseAdmin.from('users').select('*', { count: 'exact', head: true });
  const { count: posts } = await supabaseAdmin.from('posts').select('*', { count: 'exact', head: true });
  const { count: publishedPosts } = await supabaseAdmin.from('posts').select('*', { count: 'exact', head: true }).eq('is_published', true);
  const { count: recommendations } = await supabaseAdmin.from('recommendations').select('*', { count: 'exact', head: true });
  const { data: recentUsers } = await supabaseAdmin.from('users').select('id, name, email').order('created_at', { ascending: false }).limit(5);
  const { data: draftPosts } = await supabaseAdmin.from('posts').select('id, title, slug').eq('is_published', false).order('created_at', { ascending: false }).limit(5);
  
  return {
    users: users ?? 0,
    posts: posts ?? 0,
    publishedPosts: publishedPosts ?? 0,
    recommendations: recommendations ?? 0,
    recentUsers: recentUsers ?? [],
    draftPosts: draftPosts ?? []
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl md:text-3xl font-bold">Dashboard Overview</h1>
      
      {/* ✅ Grid responsif untuk kartu statistik */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Pengguna" value={stats.users.toString()} Icon={Users} />
        <StatCard title="Artikel Terpublikasi" value={`${stats.publishedPosts} / ${stats.posts}`} Icon={FileText} />
        <StatCard title="Total Rekomendasi" value={stats.recommendations.toString()} Icon={MessageSquareQuote} />
      </div>

      {/* ✅ Grid responsif untuk kartu konten */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-7">
        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Pengguna Baru</CardTitle>
            <CardDescription>5 pengguna terakhir yang mendaftar.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stats.recentUsers.map(user => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
             </Table>
          </CardContent>
        </Card>
        <Card className="xl:col-span-3">
            <CardHeader>
                <CardTitle>Draft Artikel</CardTitle>
                 <CardDescription>Artikel yang belum dipublikasikan.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {stats.draftPosts.map(post => (
                        <div key={post.id} className="flex items-center justify-between">
                            <span className="text-sm font-medium truncate pr-4">{post.title}</span>
                            <Link href={`/admin/blogs/edit/${post.id}`}>
                               <Badge variant="outline" className="flex-shrink-0">Edit</Badge>
                            </Link>
                        </div>
                    ))}
                     {stats.draftPosts.length === 0 && (
                        <p className="text-sm text-muted-foreground">Tidak ada draft.</p>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}