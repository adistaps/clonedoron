import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedDeals() {
  console.log("🌱 Starting deals seed...\n");

  try {
    // First, get some product IDs to create deals for
    const { data: products } = await supabase
      .from("products")
      .select("id, name")
      .eq("is_active", true)
      .limit(5);

    if (!products || products.length === 0) {
      console.log("❌ No active products found");
      return;
    }

    // Create sample deals with today and tomorrow as dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const deals = products.slice(0, 3).map((product, index) => ({
      product_id: product.id,
      title: ["Flash Sale", "Limited Time Offer", "Today's Deal"][index],
      discount_percent: [20, 15, 25][index],
      start_date: today.toISOString().split("T")[0],
      end_date: tomorrow.toISOString().split("T")[0],
    }));

    console.log(`📦 Inserting ${deals.length} deals...`);
    const { data: inserted, error } = await supabase
      .from("deals")
      .insert(deals)
      .select();

    if (error) {
      console.error("❌ Error inserting deals:", error);
      return;
    }

    console.log(`✅ Successfully inserted ${inserted.length} deals:\n`);
    inserted.forEach((deal, i) => {
      console.log(`  ${i + 1}. ${deal.title} - ${deal.discount_percent}% off`);
    });
    
    console.log("\n✨ Deals seed completed!");
  } catch (error) {
    console.error("❌ Seed error:", error);
  }
}

seedDeals();
