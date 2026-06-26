// Demo gallery data
export const GALLERY_ITEMS = [
  {
    id: "GAL-001",
    title: "Modern Living Room",
    category: "Wallpaper",
    image: "/categories/bedroom.jpg",
    description: "Elegant 3D wallpaper design",
    status: "Published",
    uploadedAt: "2024-12-01",
  },
  {
    id: "GAL-002",
    title: "Luxury Bedroom",
    category: "Flooring",
    image: "/categories/floor.jpg",
    description: "Premium epoxy flooring",
    status: "Published",
    uploadedAt: "2024-12-05",
  },
  {
    id: "GAL-003",
    title: "Kids Playroom",
    category: "Wallpaper",
    image: "/categories/kids.jpg",
    description: "Fun and colorful designs",
    status: "Draft",
    uploadedAt: "2024-12-10",
  },
  {
    id: "GAL-004",
    title: "Office Space",
    category: "Wallpaper",
    image: "/categories/office.jpg",
    description: "Professional office designs",
    status: "Published",
    uploadedAt: "2024-12-12",
  },
  {
    id: "GAL-005",
    title: "Modern Kitchen",
    category: "Flooring",
    image: "/slider-1.jpg",
    description: "Durable kitchen flooring",
    status: "Published",
    uploadedAt: "2024-12-15",
  },
  {
    id: "GAL-006",
    title: "Beautiful Ceiling",
    category: "Ceiling Paper",
    image: "/categories/ceilingpaper.jpg",
    description: "Stunning ceiling designs",
    status: "Draft",
    uploadedAt: "2024-12-18",
  },
];

export const CATEGORIES = ["All", "Wallpaper", "Flooring", "Ceiling Paper"];

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getGalleryItemById = (id) => GALLERY_ITEMS.find((item) => item.id === id);

export { formatDate, getGalleryItemById };
