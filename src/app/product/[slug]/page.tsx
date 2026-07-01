import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ProductDetailClient from "./ProductDetailClient";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Fetch product by slug from Supabase
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !product) {
    notFound();
  }

  return <ProductDetailClient slug={slug} />;
}
