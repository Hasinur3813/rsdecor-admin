import { ORDER_DETAILS } from "./invoice";

// Calculate customer total orders and total spent from orders
const calculateCustomerStats = () => {
  const customerStats = {};
  ORDER_DETAILS.forEach((order) => {
    if (!customerStats[order.customerId]) {
      customerStats[order.customerId] = {
        totalOrders: 0,
        totalSpent: 0,
      };
    }
    customerStats[order.customerId].totalOrders++;
    customerStats[order.customerId].totalSpent += order.total;
  });
  return customerStats;
};

const customerStats = calculateCustomerStats();

// Demo customer data
export const CUSTOMERS = [
  {
    id: "CUST-001",
    name: "Raihan Ahmed",
    phone: "01712345678",
    email: "raihan@example.com",
    area: "Dhaka",
    address: "House 123, Road 45, Dhanmondi, Dhaka",
    totalOrders: customerStats["CUST-001"]?.totalOrders || 0,
    totalSpent: customerStats["CUST-001"]?.totalSpent || 0,
    joinedDate: "2024-01-15",
    status: "Active",
  },
  {
    id: "CUST-002",
    name: "Fatema Begum",
    phone: "01812345678",
    email: "fatema@example.com",
    area: "Chittagong",
    address: "Level 5, ABC Tower, Agrabad, Chittagong",
    totalOrders: customerStats["CUST-002"]?.totalOrders || 0,
    totalSpent: customerStats["CUST-002"]?.totalSpent || 0,
    joinedDate: "2024-03-20",
    status: "Active",
  },
  {
    id: "CUST-003",
    name: "Sabbir Hossain",
    phone: "01912345678",
    email: "sabbir@example.com",
    area: "Rajshahi",
    address: "Village XYZ, Upazila ABC, Rajshahi",
    totalOrders: customerStats["CUST-003"]?.totalOrders || 0,
    totalSpent: customerStats["CUST-003"]?.totalSpent || 0,
    joinedDate: "2024-05-10",
    status: "Active",
  },
  {
    id: "CUST-004",
    name: "Nasrin Akter",
    phone: "01612345678",
    email: "nasrin@example.com",
    area: "Sylhet",
    address: "Sector 3, Jalalabad, Sylhet",
    totalOrders: customerStats["CUST-004"]?.totalOrders || 0,
    totalSpent: customerStats["CUST-004"]?.totalSpent || 0,
    joinedDate: "2024-02-18",
    status: "Inactive",
  },
  {
    id: "CUST-005",
    name: "Karim Mia",
    phone: "01512345678",
    email: "karim@example.com",
    area: "Gazipur",
    address: "Tongi, Gazipur",
    totalOrders: customerStats["CUST-005"]?.totalOrders || 0,
    totalSpent: customerStats["CUST-005"]?.totalSpent || 0,
    joinedDate: "2023-12-05",
    status: "Active",
  },
  {
    id: "CUST-006",
    name: "Sanjida Islam",
    phone: "01787654321",
    email: "sanjida@example.com",
    area: "Dhaka",
    address: "Banani, Dhaka",
    totalOrders: customerStats["CUST-006"]?.totalOrders || 0,
    totalSpent: customerStats["CUST-006"]?.totalSpent || 0,
    joinedDate: "2024-06-01",
    status: "Active",
  },
  {
    id: "CUST-007",
    name: "Tariq Hassan",
    phone: "01887654321",
    email: "tariq@example.com",
    area: "Cumilla",
    address: "Cumilla town",
    totalOrders: customerStats["CUST-007"]?.totalOrders || 0,
    totalSpent: customerStats["CUST-007"]?.totalSpent || 0,
    joinedDate: "2024-04-25",
    status: "Inactive",
  },
  {
    id: "CUST-008",
    name: "Mitu Akter",
    phone: "01987654321",
    email: "mitu@example.com",
    area: "Narayanganj",
    address: "Fatullah, Narayanganj",
    totalOrders: customerStats["CUST-008"]?.totalOrders || 0,
    totalSpent: customerStats["CUST-008"]?.totalSpent || 0,
    joinedDate: "2024-03-10",
    status: "Active",
  },
];

const formatBDT = (n) => "৳" + Number(n).toLocaleString("en-IN");
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export { formatBDT, formatDate };
