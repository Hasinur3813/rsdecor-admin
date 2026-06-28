// Product data based on demoProducts.js
export const PRODUCTS = [
  {
    id: "PRD-001",
    name: "Royal Floral 3D Wallpaper",
    slug: "royal-floral-3d-wallpaper",
    category: "3D Wallpaper",
    roomType: "Bedroom",
    material: "Fabric",
    finish: "3D Embossed",
    pricePerSqft: 140,
    warranty: "10 Years",
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    colorFamily: "Warm",
    tags: ["floral", "luxury", "bedroom", "waterproof"],
    features: [
      "3D Effect",
      "Water Resistant",
      "Easy to Install",
      "Durable",
      "Washable",
    ],
    images: ["/categories/wallpaper.jpg", "/slider-2.jpg"],
    imageAlt: "Royal floral 3D wallpaper in a bedroom interior",
    description:
      "Elegant floral 3D embossed wallpaper on premium waterproof fabric. Washable and tear-resistant.",
    stock: 45,
    status: "InStock",
    addedDate: "2024-11-15",
  },
  {
    id: "PRD-002",
    name: "Ocean Blue Epoxy Floor",
    slug: "ocean-blue-epoxy-floor",
    category: "3D Epoxy Floor",
    roomType: "Living Room",
    material: "Epoxy Resin",
    finish: "Glossy",
    pricePerSqft: 405,
    warranty: "15 Years",
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    colorFamily: "Cool",
    tags: ["epoxy", "luxury", "living room", "waterproof"],
    features: [
      "Scratch Resistant",
      "Glossy Finish",
      "Easy to Clean",
      "Long Lasting",
      "Water Proof",
    ],
    images: ["/categories/floor.jpg", "/slider-3.jpg"],
    imageAlt: "Ocean blue epoxy floor in a living room",
    description:
      "Stunning ocean blue epoxy flooring that gives a luxurious feel to any space. Highly durable and scratch resistant.",
    stock: 12,
    status: "LowStock",
    addedDate: "2024-10-20",
  },
];

// Category data from categories_example.js
export const CATEGORIES = [
  {
    key: "wallpapers",
    title: "Wallpapers",
    items: [
      { label: "3D Wallpapers", filter: { category: "3D Wallpaper" } },
      { label: "Ceiling Papers", filter: { category: "3D Ceiling Paper" } },
      {
        label: "Kids Room",
        filter: { category: "3D Wallpaper", room: "Kids Room" },
      },
      {
        label: "Bedroom",
        filter: { category: "3D Wallpaper", room: "Bedroom" },
      },
      {
        label: "Living Room",
        filter: { category: "3D Wallpaper", room: "Living Room" },
      },
      { label: "Office", filter: { category: "3D Wallpaper", room: "Office" } },
    ],
  },
  {
    key: "flooring",
    title: "Flooring",
    items: [
      { label: "3D Epoxy Floor", filter: { category: "3D Epoxy Floor" } },
      {
        label: "Marble Finish",
        filter: { category: "3D Epoxy Floor", finish: "Matte" },
      },
      {
        label: "Metallic Finish",
        filter: { category: "3D Epoxy Floor", finish: "Metallic" },
      },
    ],
  },
];

// Independent category options
export const CATEGORY_OPTIONS = [
  { label: "3D Wallpapers", value: "3D Wallpaper" },
  { label: "3D Ceiling Papers", value: "3D Ceiling Paper" },
  { label: "3D Epoxy Floor", value: "3D Epoxy Floor" },
];

// Independent room type options
export const ROOM_TYPE_OPTIONS = [
  "Bedroom",
  "Living Room",
  "Kids Room",
  "Office",
  "Dining Room",
  "Kitchen",
  "Bathroom",
];

// Features options for multi-select
export const FEATURES_OPTIONS = [
  "3D Effect",
  "Water Resistant",
  "Easy to Install",
  "Durable",
  "Scratch Resistant",
  "Glossy Finish",
  "Easy to Clean",
  "Long Lasting",
  "Light Weight",
  "Easy to Paste",
  "Washable",
  "Non-Toxic",
  "Premium Quality",
  "Fade Resistant",
  "Easy Maintenance",
  "Luxurious Look",
  "Vintage Design",
  "Soft Colors",
  "Breathable",
  "Wood Look",
  "Water Proof",
  "Termite Resistant",
  "Low Maintenance",
  "Modern Design",
  "Bold Patterns",
  "Peel & Stick",
];

// Options for select fields
export const MATERIAL_OPTIONS = [
  "Fabric",
  "Vinyl",
  "Non-Woven",
  "Paper",
  "Epoxy Resin",
  "PVC",
];
export const COLOR_FAMILY_OPTIONS = [
  "Warm",
  "Cool",
  "Neutral",
  "Bold",
  "Pastel",
];
export const WARRANTY_OPTIONS = [
  "5 Years",
  "10 Years",
  "15 Years",
  "20 Years",
  "Lifetime",
];
export const FINISH_OPTIONS = [
  "3D Embossed",
  "Glossy",
  "Matte",
  "Metallic",
  "Textured",
  "Smooth",
];

const formatBDT = (n) => "৳" + Number(n).toLocaleString("en-IN");
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export { formatBDT, formatDate };
