// Demo coupon data
export const COUPONS = [
  {
    id: "CPN-001",
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minOrder: 1000,
    maxDiscount: 500,
    usageLimit: 100,
    usedCount: 45,
    status: "Active",
    startDate: "2024-12-01",
    endDate: "2024-12-31",
    description: "Welcome discount for new customers",
  },
  {
    id: "CPN-002",
    code: "FLAT200",
    type: "fixed",
    value: 200,
    minOrder: 2000,
    maxDiscount: 200,
    usageLimit: 50,
    usedCount: 50,
    status: "Expired",
    startDate: "2024-11-01",
    endDate: "2024-11-30",
    description: "Flat discount on orders above 2000",
  },
  {
    id: "CPN-003",
    code: "HOLIDAY25",
    type: "percentage",
    value: 25,
    minOrder: 3000,
    maxDiscount: 1500,
    usageLimit: 200,
    usedCount: 78,
    status: "Active",
    startDate: "2024-12-20",
    endDate: "2025-01-10",
    description: "Holiday special discount",
  },
  {
    id: "CPN-004",
    code: "FIRST50",
    type: "fixed",
    value: 50,
    minOrder: 500,
    maxDiscount: 50,
    usageLimit: 500,
    usedCount: 0,
    status: "Inactive",
    startDate: "2025-01-01",
    endDate: "2025-02-28",
    description: "First order discount",
  },
];

// Coupon status styles for Badge component
export const COUPON_STATUS_STYLES = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-700",
  Expired: "bg-red-100 text-red-700",
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatBDT = (amount) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(amount);

const getCouponById = (id) => COUPONS.find((c) => c.id === id);

export { formatDate, formatBDT, getCouponById };
