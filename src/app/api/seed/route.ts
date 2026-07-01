import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Static data to seed
const PRODUCTS = [
  { slug: 'dithertone-pro', sku: 'dithertone-pro', name: 'DITHERTONE Pro', type: 'Plugin', price: 65.00, image_url: '/images/product-dithertone.jpg', description: 'The all-in-one Photoshop plugin for bitmapping and dithering. Trusted by 9,000+ designers.', features: ['One-click bitmap conversion', '15+ dither patterns', 'Real-time preview', 'Batch processing'], includes: ['Photoshop Plugin (.ccx)', 'User Guide PDF', 'Video Tutorial', 'Free Updates'], created_by: "DORON'S SUPPLY", compatibility: 'ADOBE PHOTOSHOP CC 2020+', is_freebie: false, is_active: true },
  { slug: 'worn-plastisol-2', sku: 'worn-plastisol-2', name: 'Worn Plastisol Texture Kit 02', type: 'Textures', price: 35.00, image_url: '/images/product-worn-plastisol-2.jpg', description: 'The Worn Plastisol 2 Texture Kit is the perfect vintage finish for your t-shirt designs.', features: ['Light to Heavy Distress', 'Made From Real Scans', 'Adds Instant Vintage Charm', 'Used on Official Merch'], includes: ['86 Hi-Res Texture PNGs', '34 Dynamic Brushes (.ABR)', '15 Seamless Patterns (.PAT)', 'Full Video Tutorial'], created_by: "DORON'S SUPPLY", compatibility: 'Any Graphics Software', is_freebie: false, is_active: true },
  { slug: 'printer-noise', sku: 'printer-noise', name: 'Printer Noise Textures', type: 'Textures', price: 30.00, image_url: '/images/product-printer-noise.jpg', description: 'Authentic printer noise textures for adding analog grit to your digital designs.', features: ['High-res scans', 'Seamless patterns', 'Print-ready'], includes: ['50+ Texture PNGs', 'Seamless Patterns', 'Instructions'], created_by: "DORON'S SUPPLY", compatibility: 'Any Graphics Software', is_freebie: false, is_active: true },
  { slug: 'mobglow', sku: 'mobglow', name: 'mobGlow Photoshop Plugin', type: 'Plugin', price: 30.00, image_url: '/images/product-mobglow.jpg', description: 'One-click realistic, dreamy glow effects for Photoshop.', features: ['Non-destructive workflow', 'Adjustable intensity', 'Color control'], includes: ['Photoshop Plugin', 'Documentation'], created_by: "DORON'S SUPPLY", compatibility: 'ADOBE PHOTOSHOP CC 2020+', is_freebie: false, is_active: true },
  { slug: 'typefx', sku: 'typefx', name: 'TypeFX', type: 'Action Set', price: 30.00, image_url: '/images/product-typefx.jpg', description: '100+ text distress effects and textures in one powerful tool.', features: ['100+ effects', 'One-click apply', 'Editable text layers'], includes: ['.ATN Action File', 'Texture Files', 'Tutorial Video'], created_by: "DORON'S SUPPLY", compatibility: 'ADOBE PHOTOSHOP CC 2020+', is_freebie: false, is_active: true },
  { slug: 'vintone', sku: 'vintone', name: 'VINTONE', type: 'Template', price: 75.00, image_url: '/images/product-vintone.jpg', description: 'Vintage screenprint FX template with halftone and xerox effects.', features: ['Halftone effects', 'Xerox simulation', 'Color separation'], includes: ['PSD Template', 'Actions', 'Instructions'], created_by: "DORON'S SUPPLY", compatibility: 'ADOBE PHOTOSHOP CC 2020+', is_freebie: false, is_active: true },
  { slug: 'chrometone', sku: 'chrometone', name: 'CHROMETONE', type: 'Action Set', price: 35.00, image_url: '/images/product-chrometone.jpg', description: 'One-click retro chrome FX with 16 preset chrome looks.', features: ['16 Preset Chrome Looks', 'Modular Glow GX', '3D Extrusion FX'], includes: ['.ATN Action File', 'Brush Presets', 'Documentation'], created_by: "DORON'S SUPPLY", compatibility: 'ADOBE PHOTOSHOP CC 2020+', is_freebie: false, is_active: true },
  { slug: 'analog-looks', sku: 'analog-looks', name: 'Analog Looks', type: 'Template', price: 35.00, image_url: '/images/product-analog-looks.jpg', description: 'Print media photo treatment kit with 25 seamless textures and custom LUTs.', features: ['25 Seamless Textures', '25 Custom LUTs', '4K+ Resolution'], includes: ['PSD Template', 'LUTs', 'Textures'], created_by: "DORON'S SUPPLY", compatibility: 'ADOBE PHOTOSHOP CC 2020+', is_freebie: false, is_active: true },
  { slug: 'crt-phaser', sku: 'crt-phaser', name: 'CRT Phaser', type: 'Plugin', price: 25.00, image_url: '/images/product-crt-phaser.jpg', description: 'Circuit bent CRT effect with one-click application.', features: ['15 Actions', 'One-Click CRT FX', 'Multiple Distortion Patterns'], includes: ['Plugin File', 'Presets', 'Documentation'], created_by: "DORON'S SUPPLY", compatibility: 'ADOBE PHOTOSHOP CC 2020+', is_freebie: false, is_active: true },
  { slug: 'depthtone-classic', sku: 'depthtone-classic', name: 'DEPTHTONE Classic', type: 'Template', price: 65.00, image_url: '/images/product-depthtone.jpg', description: 'Advanced displacement plugin for non-destructive distress mapping.', features: ['Non-destructive workflow', 'Displacement mapping', 'Sync modes'], includes: ['Plugin File', 'Displacement Maps', 'Tutorial'], created_by: "DORON'S SUPPLY", compatibility: 'ADOBE PHOTOSHOP CC 2020+', is_freebie: false, is_active: true },
  { slug: 'broken-color', sku: 'broken-color', name: 'Broken Color Textures', type: 'Textures', price: 0.00, image_url: '/images/product-broken-color.jpg', description: 'Raw, imperfect color textures for adding organic character.', features: ['High-res scans', 'Unique patterns', 'Versatile usage'], includes: ['Texture PNGs'], created_by: "DORON'S SUPPLY", compatibility: 'Any Graphics Software', is_freebie: true, is_active: true },
  { slug: 'collage-cutout', sku: 'collage-cutout', name: 'Collage Cutout', type: 'Action Set', price: 15.00, image_url: '/images/product-collage-cutout.jpg', description: 'Cut and torn paper collage FX for authentic mixed-media looks.', features: ['Realistic paper tears', 'Shadow effects', 'Layer styles'], includes: ['.ATN Action File', 'Paper Assets'], created_by: "DORON'S SUPPLY", compatibility: 'ADOBE PHOTOSHOP CC 2020+', is_freebie: false, is_active: true },
  { slug: 'grunge-frames', sku: 'grunge-frames', name: 'Grunge Frames', type: 'Textures', price: 30.00, image_url: '/images/product-grunge-frames.jpg', description: '128 transparent PNG frames with 5K+ resolution.', features: ['128 Transparent PNG Frames', '5K+ Resolution', 'Helper Actions'], includes: ['PNG Frame Files', 'Helper Actions'], created_by: "DORON'S SUPPLY", compatibility: 'Any Graphics Software', is_freebie: false, is_active: true },
  { slug: 'worn-plastisol-1', sku: 'worn-plastisol-1', name: 'Worn Plastisol Texture Kit', type: 'Textures', price: 20.00, image_url: '/images/product-worn-plastisol-1.jpg', description: '20 transparent PNG textures with 6K+ resolution.', features: ['20 Transparent PNG Textures', '6K+ Resolution', 'Drag & Drop'], includes: ['Texture PNGs'], created_by: "DORON'S SUPPLY", compatibility: 'Any Graphics Software', is_freebie: false, is_active: true },
  { slug: 'jak-typeface', sku: 'jak-typeface', name: 'JAK Typeface', type: 'Font', price: 30.00, image_url: '/images/product-jak.jpg', description: 'Industrial regular typeface with brutalist grunge aesthetic.', features: ['Regular weight', 'Industrial style', 'Brutalist aesthetic'], includes: ['.OTF Font File'], created_by: "DORON'S SUPPLY", compatibility: 'Any Graphics Software', is_freebie: false, is_active: true },
  { slug: 'aged-photocopy', sku: 'aged-photocopy', name: 'Aged Photocopy Textures', type: 'Textures', price: 25.00, image_url: '/images/product-aged-photocopy.jpg', description: '50 textures with 14K resolution and 1200 DPI.', features: ['50 Textures', '14K Resolution', '1200 DPI'], includes: ['Texture PNGs'], created_by: "DORON'S SUPPLY", compatibility: 'Any Graphics Software', is_freebie: false, is_active: true },
  { slug: 'assorted-paper', sku: 'assorted-paper', name: 'Assorted Paper Textures', type: 'Textures', price: 25.00, image_url: '/images/product-assorted-paper.jpg', description: '100 textures with 8K+ resolution and 600 DPI.', features: ['100 Textures', '8K+ Resolution', '600 DPI'], includes: ['Texture PNGs'], created_by: "DORON'S SUPPLY", compatibility: 'Any Graphics Software', is_freebie: false, is_active: true },
  { slug: 'xerox-machine', sku: 'xerox-machine', name: 'Xerox Machine Pro', type: 'Action Set', price: 35.00, image_url: '/images/product-xerox.jpg', description: 'Xerox grain FX with tri-color separation and bonus textures.', features: ['Xerox Grain FX', 'Tri-Color Separation', 'Bonus Textures'], includes: ['.ATN Action File', 'Texture Files'], created_by: "DORON'S SUPPLY", compatibility: 'ADOBE PHOTOSHOP CC 2020+', is_freebie: false, is_active: true },
  { slug: 'ink-rolls', sku: 'ink-rolls', name: 'Ink Roll Textures', type: 'Textures', price: 15.00, image_url: '/images/product-ink-rolls.jpg', description: '50 textures with 7K resolution and 1200 DPI.', features: ['50 Textures', '7K Resolution', '1200 DPI'], includes: ['Texture PNGs'], created_by: "DORON'S SUPPLY", compatibility: 'Any Graphics Software', is_freebie: false, is_active: true },
  { slug: 'pyrotone', sku: 'pyrotone', name: 'PYROTONE', type: 'Action Set', price: 30.00, image_url: '/images/product-pyrotone.jpg', description: '5 varying flame FX with auto smoke, glow, and sparks.', features: ['5 Varying Flame FX', 'Auto Smoke, Glow, & Sparks', 'One-Click'], includes: ['.ATN Action File', 'Brush Presets'], created_by: "DORON'S SUPPLY", compatibility: 'ADOBE PHOTOSHOP CC 2020+', is_freebie: false, is_active: true },
  { slug: 'neuro-ui', sku: 'neuro-ui', name: 'NEURO UI [Sci-Fi Elements Kit 01]', type: 'Action Set', price: 30.00, image_url: '/images/product-neuro-ui.jpg', description: '50 vector sci-fi HUD elements for futuristic interface designs.', features: ['50 Vector Elements', 'Sci-Fi HUD Design', 'Customizable'], includes: ['.AI / .EPS Files'], created_by: "DORON'S SUPPLY", compatibility: 'ADOBE ILLUSTRATOR CC 2020+', is_freebie: false, is_active: true },
  { slug: 'mixed-media-1', sku: 'mixed-media-1', name: 'Mixed Media Texture Kit 01', type: 'Textures', price: 35.00, image_url: '/images/product-mixed-media-1.jpg', description: '60 textures with 14K resolution for mixed-media collage effects.', features: ['60 Textures', '14K Resolution', '1200 DPI'], includes: ['Texture PNGs'], created_by: "DORON'S SUPPLY", compatibility: 'Any Graphics Software', is_freebie: false, is_active: true },
  { slug: 'jpeg-decompressor', sku: 'jpeg-decompressor', name: 'JPEG Decompressor', type: 'Action Set', price: 0.00, image_url: '/images/product-jpeg-decompressor.jpg', description: '8 actions for light to heavy decompression artifacts.', features: ['8 Actions', 'Light to Heavy Decompression', 'One-Click'], includes: ['.ATN Action File'], created_by: "DORON'S SUPPLY", compatibility: 'ADOBE PHOTOSHOP CC 2020+', is_freebie: true, is_active: true },
];

const BUNDLES = [
  { slug: 'merchandise-master-kit', name: 'MERCHANDISE', color: '#A3A3A3', save_amount: 65.00, image_url: '/images/bundle-merchandise.jpg', is_active: true },
  { slug: 'the-glitch-kit', name: 'GLITCH', color: '#A3A3A3', save_amount: 50.00, image_url: '/images/bundle-glitch.jpg', is_active: true },
  { slug: 'silver-bundle', name: 'SILVER', color: '#A3A3A3', save_amount: 296.00, image_url: '/images/bundle-silver.jpg', is_active: true },
  { slug: 'master-kit', name: 'MASTER KIT', color: '#A3A3A3', save_amount: 120.00, image_url: '/images/bundle-master-kit.jpg', is_active: true },
  { slug: 'mixed-media-medley', name: 'MIXED MEDIA', color: '#A3A3A3', save_amount: 15.00, image_url: '/images/bundle-mixed-media.jpg', is_active: true },
  { slug: 'texture-bundle', name: 'BUNDLE', color: '#A3A3A3', save_amount: 85.00, image_url: '/images/bundle-texture.jpg', is_active: true },
];

export async function GET() {
  if (!supabaseServiceKey) {
    return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 });
  }

  const admin = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Upsert products
    const { error: prodError } = await admin
      .from('products')
      .upsert(PRODUCTS, { onConflict: 'slug', ignoreDuplicates: false });

    if (prodError) {
      return NextResponse.json({ error: 'Products seed failed', detail: prodError.message }, { status: 500 });
    }

    // Upsert bundles
    const { error: bundleError } = await admin
      .from('bundles')
      .upsert(BUNDLES, { onConflict: 'slug', ignoreDuplicates: false });

    if (bundleError) {
      return NextResponse.json({ error: 'Bundles seed failed', detail: bundleError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${PRODUCTS.length} products and ${BUNDLES.length} bundles into Supabase.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Unexpected error', detail: message }, { status: 500 });
  }
}
