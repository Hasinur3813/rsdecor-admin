// Demo broadcast data
export const BROADCASTS = [
  {
    id: "BRD-001",
    title: "New Year's Sale!",
    message:
      "Hi! We're having a huge sale this New Year! Get 30% off on all 3D wallpapers!",
    recipients: 1240,
    status: "Sent",
    date: "2024-12-15",
  },
  {
    id: "BRD-002",
    title: "Epoxy Flooring Workshop",
    message:
      "Join us for a free workshop on epoxy flooring installation! Limited seats available!",
    recipients: 850,
    status: "Sent",
    date: "2024-12-10",
  },
  {
    id: "BRD-003",
    title: "New Design Collection",
    message:
      "Check out our new ceiling paper designs! Perfect for any room in your home!",
    recipients: 650,
    status: "Draft",
    date: "2024-12-18",
  },
];

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export { formatDate };
