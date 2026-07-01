/**
 * Seed script: Load products from data/products.ts into Supabase
 * Usage: node --env-file-if-exists=/vercel/share/.env.project scripts/seed-products.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Category mapping from static data
const categories = {
  'assets': 'assets',
  'textures': 'textures',
  'freebies': 'freebies',
  'plugins-software': 'plugins-software',
  'actions-templates': 'actions-templates',
  'fonts-vector': 'fonts-vector',
  'vintage-merch': 'vintage-merch',
  'analog-print': 'analog-print',
};

// Product data from src/data/products.ts
const productsData = [
  {
    slug: 'dithertone-pro',
    name: 'DITHERTONE Pro',
    type: 'Plugin',
    price: 65.00,
    image_url: '/images/product-dithertone.jpg',
    description: 'The all-in-one Photoshop plugin for bitmapping and dithering. Trusted by 9,000+ designers.',
    features: ['One-click bitmap conversion', '15+ dither patterns', 'Real-time preview', 'Batch processing'],
    includes: ['Photoshop Plugin (.ccx)', 'User Guide PDF', 'Video Tutorial', 'Free Updates'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'ADOBE PHOTOSHOP CC 2020+',
    is_freebie: false,
  },
  {
    slug: 'worn-plastisol-2',
    name: 'Worn Plastisol Texture Kit 02',
    type: 'Textures',
    price: 35.00,
    image_url: '/images/product-worn-plastisol-2.jpg',
    description: 'The Worn Plastisol 2 Texture Kit is the perfect vintage finish for your t-shirt designs: 43 high-res .PNG scans of real worn plastisol ink, 34 dynamic .ABR brushes, and 15 seamless .PAT patterns. Each texture comes in standard and heavier versions for full control, giving you double the textures of Worn Plastisol 1, plus more.',
    features: ['Light to Heavy Distress', 'Made From Real Scans Of Cracked Screenprints', 'Adds Instant Vintage Charm To Designs', 'Used on Official Merch for Nirvana, AC/DC, KISS, Metallica, etc.'],
    includes: ['86 Hi-Res Transparent Texture PNGs', '34 Dynamic, Accent, & Pattern Brushes (.ABR)', '15 Seamless Texture Patterns (.PAT)', 'Full Video Tutorial'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'Any Graphics Software',
    is_freebie: false,
  },
  {
    slug: 'printer-noise',
    name: 'Printer Noise Textures',
    type: 'Textures',
    price: 30.00,
    image_url: '/images/product-printer-noise.jpg',
    description: 'Authentic printer noise textures for adding analog grit to your digital designs.',
    features: ['High-res scans', 'Seamless patterns', 'Print-ready'],
    includes: ['50+ Texture PNGs', 'Seamless Patterns', 'Instructions'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'Any Graphics Software',
    is_freebie: false,
  },
  {
    slug: 'mobglow',
    name: 'mobGlow Photoshop Plugin',
    type: 'Plugin',
    price: 30.00,
    image_url: '/images/product-mobglow.jpg',
    description: 'One-click realistic, dreamy glow effects for Photoshop.',
    features: ['Non-destructive workflow', 'Adjustable intensity', 'Color control'],
    includes: ['Photoshop Plugin', 'Documentation'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'ADOBE PHOTOSHOP CC 2020+',
    is_freebie: false,
  },
  {
    slug: 'typefx',
    name: 'TypeFX',
    type: 'Action Set',
    price: 30.00,
    image_url: '/images/product-typefx.jpg',
    description: '100+ text distress effects and textures in one powerful tool.',
    features: ['100+ effects', 'One-click apply', 'Editable text layers'],
    includes: ['.ATN Action File', 'Texture Files', 'Tutorial Video'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'ADOBE PHOTOSHOP CC 2020+',
    is_freebie: false,
  },
  {
    slug: 'vintone',
    name: 'VINTONE',
    type: 'Template',
    price: 75.00,
    image_url: '/images/product-vintone.jpg',
    description: 'Vintage screenprint FX template with halftone and xerox effects.',
    features: ['Halftone effects', 'Xerox simulation', 'Color separation'],
    includes: ['PSD Template', 'Actions', 'Instructions'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'ADOBE PHOTOSHOP CC 2020+',
    is_freebie: false,
  },
  {
    slug: 'chrometone',
    name: 'CHROMETONE',
    type: 'Action Set',
    price: 35.00,
    image_url: '/images/product-chrometone.jpg',
    description: 'One-click retro chrome FX with 16 preset chrome looks.',
    features: ['16 Preset Chrome Looks', 'Modular Glow GX', '3D Extrusion FX'],
    includes: ['.ATN Action File', 'Brush Presets', 'Documentation'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'ADOBE PHOTOSHOP CC 2020+',
    is_freebie: false,
  },
  {
    slug: 'analog-looks',
    name: 'Analog Looks',
    type: 'Template',
    price: 35.00,
    image_url: '/images/product-analog-looks.jpg',
    description: 'Print media photo treatment kit with 25 seamless textures and custom LUTs.',
    features: ['25 Seamless Textures', '25 Custom LUTs', '4K+ Resolution'],
    includes: ['PSD Template', 'LUTs', 'Textures'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'ADOBE PHOTOSHOP CC 2020+',
    is_freebie: false,
  },
  {
    slug: 'crt-phaser',
    name: 'CRT Phaser',
    type: 'Plugin',
    price: 25.00,
    image_url: '/images/product-crt-phaser.jpg',
    description: 'Circuit bent CRT effect with one-click application and multiple distortion patterns.',
    features: ['15 Actions', 'One-Click CRT FX', 'Multiple Distortion Patterns'],
    includes: ['Plugin File', 'Presets', 'Documentation'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'ADOBE PHOTOSHOP CC 2020+',
    is_freebie: false,
  },
  {
    slug: 'depthtone-classic',
    name: 'DEPTHTONE Classic',
    type: 'Template',
    price: 65.00,
    image_url: '/images/product-depthtone.jpg',
    description: 'Advanced displacement plugin for non-destructive distress mapping in Photoshop.',
    features: ['Non-destructive workflow', 'Displacement mapping', 'Sync modes'],
    includes: ['Plugin File', 'Displacement Maps', 'Tutorial'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'ADOBE PHOTOSHOP CC 2020+',
    is_freebie: false,
  },
  {
    slug: 'broken-color',
    name: 'Broken Color Textures',
    type: 'Textures',
    price: 0.00,
    image_url: '/images/product-broken-color.jpg',
    description: 'Raw, imperfect color textures for adding organic character to designs.',
    features: ['High-res scans', 'Unique patterns', 'Versatile usage'],
    includes: ['Texture PNGs'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'Any Graphics Software',
    is_freebie: true,
  },
  {
    slug: 'collage-cutout',
    name: 'Collage Cutout',
    type: 'Action Set',
    price: 15.00,
    image_url: '/images/product-collage-cutout.jpg',
    description: 'Cut and torn paper collage FX for authentic mixed-media looks.',
    features: ['Realistic paper tears', 'Shadow effects', 'Layer styles'],
    includes: ['.ATN Action File', 'Paper Assets'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'ADOBE PHOTOSHOP CC 2020+',
    is_freebie: false,
  },
  {
    slug: 'grunge-frames',
    name: 'Grunge Frames',
    type: 'Textures',
    price: 30.00,
    image_url: '/images/product-grunge-frames.jpg',
    description: '128 transparent PNG frames with 5K+ resolution and helper actions.',
    features: ['128 Transparent PNG Frames', '5K+ Resolution', 'Helper Actions'],
    includes: ['PNG Frame Files', 'Helper Actions'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'Any Graphics Software',
    is_freebie: false,
  },
  {
    slug: 'worn-plastisol-1',
    name: 'Worn Plastisol Texture Kit',
    type: 'Textures',
    price: 20.00,
    image_url: '/images/product-worn-plastisol-1.jpg',
    description: '20 transparent PNG textures with 6K+ resolution, drag & drop ready.',
    features: ['20 Transparent PNG Textures', '6K+ Resolution', 'Drag & Drop'],
    includes: ['Texture PNGs'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'Any Graphics Software',
    is_freebie: false,
  },
  {
    slug: 'jak-typeface',
    name: 'JAK Typeface',
    type: 'Font',
    price: 30.00,
    image_url: '/images/product-jak.jpg',
    description: 'Industrial regular typeface with brutalist grunge aesthetic.',
    features: ['Regular weight', 'Industrial style', 'Brutalist aesthetic'],
    includes: ['.OTF Font File'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'Any Graphics Software',
    is_freebie: false,
  },
  {
    slug: 'aged-photocopy',
    name: 'Aged Photocopy Textures',
    type: 'Textures',
    price: 25.00,
    image_url: '/images/product-aged-photocopy.jpg',
    description: '50 textures with 14K resolution and 1200 DPI for authentic aged copy looks.',
    features: ['50 Textures', '14K Resolution', '1200 DPI'],
    includes: ['Texture PNGs'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'Any Graphics Software',
    is_freebie: false,
  },
  {
    slug: 'assorted-paper',
    name: 'Assorted Paper Textures',
    type: 'Textures',
    price: 25.00,
    image_url: '/images/product-assorted-paper.jpg',
    description: '100 textures with 8K+ resolution and 600 DPI for paper backgrounds.',
    features: ['100 Textures', '8K+ Resolution', '600 DPI'],
    includes: ['Texture PNGs'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'Any Graphics Software',
    is_freebie: false,
  },
  {
    slug: 'xerox-machine',
    name: 'Xerox Machine Pro',
    type: 'Action Set',
    price: 35.00,
    image_url: '/images/product-xerox.jpg',
    description: 'Xerox grain FX with tri-color separation and bonus textures.',
    features: ['Xerox Grain FX', 'Tri-Color Separation', 'Bonus Textures'],
    includes: ['.ATN Action File', 'Texture Files'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'ADOBE PHOTOSHOP CC 2020+',
    is_freebie: false,
  },
  {
    slug: 'ink-rolls',
    name: 'Ink Roll Textures',
    type: 'Textures',
    price: 15.00,
    image_url: '/images/product-ink-rolls.jpg',
    description: '50 textures with 7K resolution and 1200 DPI of authentic ink roll patterns.',
    features: ['50 Textures', '7K Resolution', '1200 DPI'],
    includes: ['Texture PNGs'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'Any Graphics Software',
    is_freebie: false,
  },
  {
    slug: 'pyrotone',
    name: 'PYROTONE',
    type: 'Action Set',
    price: 30.00,
    image_url: '/images/product-pyrotone.jpg',
    description: '5 varying flame FX with auto smoke, glow, and sparks. One-click application.',
    features: ['5 Varying Flame FX', 'Auto Smoke, Glow, & Sparks', 'One-Click'],
    includes: ['.ATN Action File', 'Brush Presets'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'ADOBE PHOTOSHOP CC 2020+',
    is_freebie: false,
  },
  {
    slug: 'neuro-ui',
    name: 'NEURO UI [Sci-Fi Elements Kit 01]',
    type: 'Action Set',
    price: 30.00,
    image_url: '/images/product-neuro-ui.jpg',
    description: '50 vector sci-fi HUD elements for futuristic interface designs.',
    features: ['50 Vector Elements', 'Sci-Fi HUD Design', 'Customizable'],
    includes: ['.AI / .EPS Files'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'ADOBE ILLUSTRATOR CC 2020+',
    is_freebie: false,
  },
  {
    slug: 'mixed-media-1',
    name: 'Mixed Media Texture Kit 01',
    type: 'Textures',
    price: 35.00,
    image_url: '/images/product-mixed-media-1.jpg',
    description: '60 textures with 14K resolution and 1200 DPI for mixed-media collage effects.',
    features: ['60 Textures', '14K Resolution', '1200 DPI'],
    includes: ['Texture PNGs'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'Any Graphics Software',
    is_freebie: false,
  },
  {
    slug: 'jpeg-decompressor',
    name: 'JPEG Decompressor',
    type: 'Action Set',
    price: 0.00,
    image_url: '/images/product-jpeg-decompressor.jpg',
    description: '8 actions for light to heavy decompression artifacts. One-click apply.',
    features: ['8 Actions', 'Light to Heavy Decompression', 'One-Click'],
    includes: ['.ATN Action File'],
    created_by: 'DORON\'S SUPPLY',
    compatibility: 'ADOBE PHOTOSHOP CC 2020+',
    is_freebie: true,
  },
];

async function seedProducts() {
  console.log('🌱 Starting product seed...\n');

  try {
    // Insert products
    console.log(`📦 Inserting ${productsData.length} products...`);
    const { data: inserted, error: insertError } = await supabase
      .from('products')
      .insert(productsData)
      .select();

    if (insertError) {
      console.error('❌ Error inserting products:', insertError);
      process.exit(1);
    }

    console.log(`✅ Successfully inserted ${inserted.length} products\n`);

    // Verify count
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    console.log(`📊 Total products in database: ${count}`);
    console.log('✅ Seed completed successfully!\n');

  } catch (error) {
    console.error('❌ Error during seed:', error);
    process.exit(1);
  }
}

seedProducts();
