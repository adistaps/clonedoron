import { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "assets",
    name: "ASSETS",
    subcategories: [
      { id: "all-assets", name: "ALL-ASSETS" },
      { id: "plugins-software", name: "PLUGINS & SOFTWARE" },
      { id: "actions-templates", name: "ACTIONS & TEMPLATES" },
      { id: "fonts-vector", name: "FONTS & VECTOR" },
    ],
  },
  {
    id: "textures",
    name: "TEXTURES",
    subcategories: [
      { id: "all-textures", name: "ALL-TEXTURES" },
      { id: "analog-print", name: "ANALOG-PRINT" },
      { id: "vintage-merch", name: "VINTAGE-MERCH" },
    ],
  },
  {
    id: "mockups",
    name: "MOCKUPS",
    subcategories: [
      { id: "clothing", name: "CLOTHING" },
    ],
  },
  {
    id: "bundles",
    name: "BUNDLES",
    subcategories: [
      { id: "all-bundles", name: "ALL-BUNDLES" },
      { id: "popular", name: "POPULAR" },
    ],
  },
  {
    id: "popular",
    name: "POPULAR",
    subcategories: [
      { id: "best-sellers", name: "BEST-SELLERS" },
    ],
  },
  {
    id: "freebies",
    name: "FREEBIES",
    subcategories: [
      { id: "free", name: "FREE" },
    ],
  },
];

export const shopCategoryNav = [
  { id: "mockups", number: "01", name: "mockups" },
  { id: "textures", number: "02", name: "Textures" },
  { id: "tools", number: "03", name: "tools" },
  { id: "bundles", number: "04", name: "bundles" },
  { id: "fonts", number: "05", name: "fonts" },
  { id: "freebies", number: "06", name: "freebies" },
];

export const shopByTypeCategories = [
  { id: "assets", label: "[ Assets ]", image: "/images/cat-assets.jpg" },
  { id: "textures", label: "[ Texture ]", image: "/images/cat-textures.jpg" },
  { id: "mockups", label: "[ Mockups ]", image: "/images/cat-mockups.jpg" },
  { id: "bundles", label: "[ Bundles ]", image: "/images/cat-bundles.jpg" },
  { id: "vector", label: "[ Vector ]", image: "/images/cat-vector.jpg" },
];
