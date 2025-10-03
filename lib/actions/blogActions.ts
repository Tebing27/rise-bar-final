// lib/actions/blogActions.ts
"use server";

import { db } from "@/lib/supabase";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";

export type BlogFormState = {
  success: boolean;
  message?: string;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

// ... (fungsi getAllTags dan getPosts tidak berubah)
const searchParamsSchema = z.object({
  search: z.string().optional(),
  sortBy: z.enum(["newest", "popular"]).default("newest"),
  page: z.coerce.number().min(1).default(1),
  tag: z.string().optional(),
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- SKEMA VALIDASI DIPERBARUI ---
const PostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, { message: "Judul minimal 5 karakter." }),
  author_name: z
    .string()
    .min(3, { message: "Nama penulis minimal 3 karakter." }),
  slug: z
    .string()
    .min(5, { message: "Slug minimal 5 karakter." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).",
    }),
  content: z
    .string()
    .max(300, { message: "Deskripsi singkat maksimal 300 karakter." })
    .optional(), // Sekarang menjadi deskripsi singkat & opsional
  image_url: z.string().optional(),
  external_url: z
    .string()
    .url({ message: "Harap masukkan URL yang valid (contoh: https://...)" }), // Kolom baru untuk link eksternal
  is_published: z.boolean(),
  is_popular: z.boolean(),
  tags: z.string().optional(),
});

async function handleTags(post_id: string, tagsString?: string | null) {
  await supabaseAdmin.from("post_tags").delete().eq("post_id", post_id);

  if (!tagsString) return;

  const tagNames = tagsString
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
  if (tagNames.length === 0) return;

  const { data: existingTags } = await supabaseAdmin
    .from("tags")
    .select("id, name")
    .in("name", tagNames);
  const existingTagNames = existingTags?.map((t) => t.name) || [];

  const newTagNames = tagNames.filter(
    (name) => !existingTagNames.includes(name)
  );
  let newTags: { id: string; name: string }[] = [];

  if (newTagNames.length > 0) {
    const { data } = await supabaseAdmin
      .from("tags")
      .insert(newTagNames.map((name) => ({ name })))
      .select();
    newTags = data || [];
  }

  const allTagIds = [...(existingTags || []), ...newTags].map((t) => t.id);

  await supabaseAdmin
    .from("post_tags")
    .insert(allTagIds.map((tag_id) => ({ post_id, tag_id })));
}

export async function getAllTags() {
  const { data, error } = await db
    .from("tags")
    .select("name")
    .order("name", { ascending: true });
  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
  return data;
}

export async function getPosts(params: {
  search?: string;
  sortBy?: string;
  page?: number;
  tag?: string;
}) {
  const validatedParams = searchParamsSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error("Invalid search parameters.");
  }

  const { search, sortBy, page, tag } = validatedParams.data;
  const postsPerPage = 6; // Tampilkan lebih banyak di halaman daftar
  const from = (page - 1) * postsPerPage;
  const to = from + postsPerPage - 1;

  let query;
  if (tag) {
    query = db
      .from("posts")
      .select(`*, tags!inner(name)`, { count: "exact" })
      .eq("is_published", true)
      .eq("tags.name", tag);
  } else {
    query = db
      .from("posts")
      .select(`*, tags(name)`, { count: "exact" })
      .eq("is_published", true);
  }

  if (search) {
    query = query.textSearch("title", search, {
      type: "plain",
      config: "english",
    });
  }

  if (sortBy === "popular") {
    query = query.order("view_count", { ascending: false });
  } else {
    query = query.order("published_at", { ascending: false });
  }

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], totalPages: 0 };
  }

  const totalPages = Math.ceil((count || 0) / postsPerPage);

  return { posts: data, totalPages };
}

// --- FUNGSI UPSERT DIPERBARUI ---
export async function upsertPost(
  prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  const rawData = {
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    author_name: formData.get("author_name"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    image_url: formData.get("image_url"),
    external_url: formData.get("external_url"), // Ambil data URL
    is_published: formData.get("is_published") === "on",
    is_popular: formData.get("is_popular") === "on",
    tags: formData.get("tags"),
  };

  const validatedFields = PostSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, tags, ...postData } = validatedFields.data;

  try {
    let titleQuery = supabaseAdmin
      .from("posts")
      .select("id")
      .eq("title", postData.title)
      .limit(1);
    if (id) {
      titleQuery = titleQuery.not("id", "eq", id);
    }
    const { data: duplicateTitle } = await titleQuery;
    if (duplicateTitle && duplicateTitle.length > 0) {
      return {
        success: false,
        errors: { title: ["Judul ini sudah digunakan."] },
      };
    }

    let slugQuery = supabaseAdmin
      .from("posts")
      .select("id")
      .eq("slug", postData.slug)
      .limit(1);
    if (id) {
      slugQuery = slugQuery.not("id", "eq", id);
    }
    const { data: duplicateSlug } = await slugQuery;
    if (duplicateSlug && duplicateSlug.length > 0) {
      return { success: false, errors: { slug: ["URL ini sudah digunakan."] } };
    }
  } catch {
    return { success: false, message: "Gagal melakukan validasi ke database." };
  }

  const dataToUpsert = {
    ...postData,
    published_at:
      postData.is_published && !id ? new Date().toISOString() : undefined,
  };

  try {
    const { data: upsertedPost, error } = await supabaseAdmin
      .from("posts")
      .upsert({ id, ...dataToUpsert })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    if (!upsertedPost)
      throw new Error("Gagal mendapatkan ID post setelah upsert.");

    await handleTags(upsertedPost.id, tags);
  } catch (e) {
    return { success: false, message: (e as Error).message };
  }

  revalidatePath("/");
  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
  revalidatePath(`/blog/${postData.slug}`);
  redirect("/admin/blogs");
}

// ... (fungsi getCloudinarySignature dan deletePost tidak berubah)

export async function getCloudinarySignature() {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    process.env.CLOUDINARY_API_SECRET!
  );

  return { timestamp, signature };
}

export async function deletePost(postId: string) {
  if (!postId) {
    return { success: false, message: "ID Post tidak valid." };
  }

  try {
    await supabaseAdmin.from("post_tags").delete().eq("post_id", postId);

    const { data: post } = await supabaseAdmin
      .from("posts")
      .select("image_url")
      .eq("id", postId)
      .single();
    if (post?.image_url) {
      const publicId = post.image_url.split("/").pop()?.split(".")[0];
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    const { error } = await supabaseAdmin
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/blogs");
    revalidatePath("/blog");

    return { success: true, message: "Artikel berhasil dihapus." };
  } catch (e) {
    const error = e as Error;
    return { success: false, message: error.message };
  }
}
