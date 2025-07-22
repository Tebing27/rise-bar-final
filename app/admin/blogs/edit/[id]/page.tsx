// app/admin/blogs/edit/[id]/page.tsx
import { PostForm } from '@/components/admin/PostForm';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { notFound } from 'next/navigation';

interface PostWithTags {
  id: string;
  title?: string;
  slug?: string;
  author_name?: string;
  image_url?: string;
  content?: string;
  is_published?: boolean;
  is_popular?: boolean;
  tags: { name: string }[];
}

async function getPostById(id: string) {
  // Update the query to select the post and its related tags
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*, tags(name)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching post by id:', error);
    notFound();
  }
  return data as PostWithTags;
}

// export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {

export default async function EditPostPage({ params }: { params: Promise<{ id: string }>}) {
  const { id } = await params;
  const post = await getPostById(id);

  // Format the tags from an array of objects to a comma-separated string
  const tagsString = post.tags.map((tag) => tag.name).join(', ');

  return (
    <div className="mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Artikel</h1>
      <div className="p-8 bg-white rounded-lg shadow">
        {/* Pass both the post and the formatted tags string to the form */}
        <PostForm post={post} tags={tagsString} />
      </div>
    </div>
  );
}