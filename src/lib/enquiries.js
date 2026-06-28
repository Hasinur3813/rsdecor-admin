// Demo enquiry data
export const ENQUIRIES = [
  {
    id: "ENQ-001",
    name: "Sanjida Islam",
    phone: "01712345678",
    email: "sanjida@example.com",
    area: "Dhaka",
    service: "3D Wallpaper",
    message: "Hi, I'm interested in your Royal Floral 3D Wallpaper. Can you please send me a price quote for a 12x15 feet room?",
    status: "New",
    date: "2024-12-21",
  },
  {
    id: "ENQ-002",
    name: "Tariq Hassan",
    phone: "01812345678",
    email: "tariq@example.com",
    area: "Cumilla",
    service: "Epoxy Floor",
    message: "What's the installation process for epoxy flooring? How long does it take?",
    status: "New",
    date: "2024-12-20",
  },
  {
    id: "ENQ-003",
    name: "Mitu Akter",
    phone: "01987654321",
    email: "mitu@example.com",
    area: "Narayanganj",
    service: "Ceiling Paper",
    message: "Do you have ceiling paper options for small bedrooms?",
    status: "Replied",
    date: "2024-12-19",
  },
  {
    id: "ENQ-004",
    name: "Rafiqul Islam",
    phone: "01612345678",
    email: "rafiqul@example.com",
    area: "Bogura",
    service: "3D Wallpaper",
    message: "Can you customize the wallpaper design?",
    status: "New",
    date: "2024-12-18",
  },
  {
    id: "ENQ-005",
    name: "Fatema Begum",
    phone: "01887654321",
    email: "fatema@example.com",
    area: "Chittagong",
    service: "Epoxy Floor",
    message: "Do you offer a warranty on your epoxy flooring?",
    status: "Replied",
    date: "2024-12-17",
  },
];

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export { formatDate };
