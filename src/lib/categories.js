// Demo category data based on categories_example.js
export const CATEGORIES = [
  {
    id: "CAT-001",
    key: "wallpapers",
    title: "Wallpapers",
    status: "Active",
    createdAt: "2024-11-01",
    items: [
      {
        id: "SUB-001",
        label: "3D Wallpapers",
        totalDesign: "120",
        image: "/slider-1.jpg",
        slug: "3d-wallpapers",
        filter: { category: "3D Wallpaper" },
      },
      {
        id: "SUB-002",
        label: "Ceiling Papers",
        totalDesign: "120",
        image: "/slider-2.jpg",
        slug: "ceiling-papers",
        filter: { category: "3D Ceiling Paper" },
      },
      {
        id: "SUB-003",
        label: "Kids Room",
        totalDesign: "120",
        image: "/slider-3.jpg",
        slug: "kids-room",
        filter: { category: "3D Wallpaper", room: "Kids Room" },
      },
      {
        id: "SUB-004",
        label: "Bedroom",
        totalDesign: "120",
        image: "/categories/bedroom.jpg",
        slug: "bedroom",
        filter: { category: "3D Wallpaper", room: "Bedroom" },
      },
      {
        id: "SUB-005",
        label: "Living Room",
        totalDesign: "120",
        image: "/categories/wallpaper.jpg",
        slug: "living-room",
        filter: { category: "3D Wallpaper", room: "Living Room" },
      },
      {
        id: "SUB-006",
        label: "Office",
        totalDesign: "120",
        image: "/categories/office.jpg",
        slug: "office",
        filter: { category: "3D Wallpaper", room: "Office" },
      },
    ],
  },
  {
    id: "CAT-002",
    key: "flooring",
    title: "Flooring",
    status: "Active",
    createdAt: "2024-11-05",
    items: [
      {
        id: "SUB-007",
        label: "3D Epoxy Floor",
        totalDesign: "120",
        image: "/categories/floor.jpg",
        slug: "3d-epoxy-floor",
        filter: { category: "3D Epoxy Floor" },
      },
      {
        id: "SUB-008",
        label: "Marble Finish",
        totalDesign: "120",
        image: "/slider-1.jpg",
        slug: "marble-finish",
        filter: { category: "3D Epoxy Floor", finish: "Matte" },
      },
      {
        id: "SUB-009",
        label: "Metallic Finish",
        totalDesign: "120",
        image: "/slider-2.jpg",
        slug: "metallic-finish",
        filter: { category: "3D Epoxy Floor", finish: "Metallic" },
      },
    ],
  },
  {
    id: "CAT-003",
    key: "featured",
    title: "Featured",
    label: "New Arrivals",
    totalDesign: "120",
    description:
      "Discover our latest premium collection of wallpapers and flooring.",
    image: "/slider-3.jpg",
    status: "Active",
    createdAt: "2024-11-10",
    items: [],
  },
];

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getCategoryById = (id) => CATEGORIES.find((cat) => cat.id === id);
const getCategoryByKey = (key) => CATEGORIES.find((cat) => cat.key === key);

// Subcategory helpers
const getSubcategoryById = (categoryId, subcategoryId) => {
  const category = getCategoryById(categoryId);
  if (!category) return null;
  return category.items?.find((item) => item.id === subcategoryId) || null;
};

export { formatDate, getCategoryById, getCategoryByKey, getSubcategoryById };
