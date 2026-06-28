// Demo slider data
export const SLIDERS = [
  {
    id: "SLD-001",
    badge: "New Collection",
    title: "Modern 3D Wallpaper",
    subtitle: "Transform your space with premium quality wallpapers",
    bgImage: "/slider-1.jpg",
    button1Text: "Shop Now",
    button1Url: "/products",
    button2Text: "View Collection",
    button2Url: "/gallery",
    order: 1,
    status: "Active",
    createdAt: "2024-12-01",
  },
  {
    id: "SLD-002",
    badge: "Limited Offer",
    title: "Epoxy Flooring Sale",
    subtitle: "Get 20% off on all epoxy flooring solutions",
    bgImage: "/slider-2.jpg",
    button1Text: "Explore",
    button1Url: "/products",
    button2Text: "Contact Us",
    button2Url: "/enquiries",
    order: 2,
    status: "Active",
    createdAt: "2024-12-05",
  },
  {
    id: "SLD-003",
    badge: "Holiday Special",
    title: "Celebrate with Style",
    subtitle: "Premium decorations for your festive season",
    bgImage: "/slider-3.jpg",
    button1Text: "View Catalog",
    button1Url: "/products",
    button2Text: "Book Now",
    button2Url: "/enquiries",
    order: 3,
    status: "Inactive",
    createdAt: "2024-12-10",
  },
];

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getSliderById = (id) => SLIDERS.find((s) => s.id === id);

export { formatDate, getSliderById };
