const PRODUCT_CATEGORIES = {
  wallpapers: {
    title: "Wallpapers",
    items: [
      {
        label: "3D Wallpapers",
        totalDesign: "120",
        image: "/slider.1.jpg",
        slug: "3d-wallpapers",
        filter: { category: "3D Wallpaper" },
      },
      {
        label: "Ceiling Papers",
        totalDesign: "120",
        image: "/slider.2.jpg",
        slug: "ceiling-papers",
        filter: { category: "3D Ceiling Paper" },
      },
      {
        label: "Kids Room",
        totalDesign: "120",
        image: "/slider.3.jpg",
        slug: "kids-room",
        filter: { category: "3D Wallpaper", room: "Kids Room" },
      },
      {
        label: "Bedroom",
        totalDesign: "120",
        image: "/slider.4.jpg",
        slug: "bedroom",
        filter: { category: "3D Wallpaper", room: "Bedroom" },
      },
      {
        label: "Living Room",
        totalDesign: "120",
        image: "/slider.5.jpg",
        slug: "living-room",
        filter: { category: "3D Wallpaper", room: "Living Room" },
      },
      {
        label: "Office",
        totalDesign: "120",
        image: "/slider.6.jpg",
        slug: "office",
        filter: { category: "3D Wallpaper", room: "Office" },
      },
    ],
  },
  flooring: {
    title: "Flooring",
    items: [
      {
        label: "3D Epoxy Floor",
        totalDesign: "120",
        image: "/slider.7.jpg",
        slug: "3d-epoxy-floor",
        filter: { category: "3D Epoxy Floor" },
      },
      {
        label: "Marble Finish",
        totalDesign: "120",
        image: "/slider.8.jpg",
        slug: "marble-finish",
        filter: { category: "3D Epoxy Floor", finish: "Matte" },
      },
      {
        label: "Metallic Finish",
        totalDesign: "120",
        image: "/slider.9.jpg",
        slug: "metallic-finish",
        filter: { category: "3D Epoxy Floor", finish: "Metallic" },
      },
    ],
  },
  featured: {
    title: "Featured",
    label: "New Arrivals",
    totalDesign: "120",
    description:
      "Discover our latest premium collection of wallpapers and flooring.",
    image: "/images/featured-arrivals.jpg",
  },
};
