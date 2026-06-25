// Demo order details data for invoice generation
export const ORDER_DETAILS = [
  {
    id: "ORD-2024-124",
    customer: "Raihan Ahmed",
    customerId: "CUST-001",
    phone: "01712345678",
    email: "raihan@example.com",
    area: "Dhaka",
    address: "House 123, Road 45, Dhanmondi, Dhaka",
    items: [
      {
        id: 1,
        name: "Royal Floral 3D Wallpaper",
        price: 14000,
        quantity: 2,
        image: "/categories/wallpaper.jpg",
      },
    ],
    total: 33600,
    status: "Completed",
    date: "2024-12-20",
    deliveryDate: "2024-12-22",
    paymentMethod: "Bkash",
    paymentStatus: "Paid",
    notes: "Please deliver after 5 PM",
  },
  {
    id: "ORD-2024-123",
    customer: "Fatema Begum",
    customerId: "CUST-002",
    phone: "01812345678",
    email: "fatema@example.com",
    area: "Chittagong",
    address: "Level 5, ABC Tower, Agrabad, Chittagong",
    items: [
      {
        id: 1,
        name: "Ocean Blue Epoxy Floor",
        price: 40500,
        quantity: 2,
        image: "/categories/floor.jpg",
      },
    ],
    total: 81000,
    status: "In Progress",
    date: "2024-12-19",
    deliveryDate: "2024-12-25",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Unpaid",
    notes: "Need installation service",
  },
  {
    id: "ORD-2024-122",
    customer: "Sabbir Hossain",
    customerId: "CUST-003",
    phone: "01912345678",
    email: "sabbir@example.com",
    area: "Rajshahi",
    address: "Village XYZ, Upazila ABC, Rajshahi",
    items: [
      {
        id: 1,
        name: "Cloud Dream Ceiling Paper",
        price: 14000,
        quantity: 1,
        image: "/categories/celingpaper.jpg",
      },
    ],
    total: 16800,
    status: "Confirmed",
    date: "2024-12-18",
    deliveryDate: "2024-12-21",
    paymentMethod: "Nagad",
    paymentStatus: "Paid",
    notes: "",
  },
  {
    id: "ORD-2024-121",
    customer: "Nasrin Akter",
    customerId: "CUST-004",
    phone: "01612345678",
    email: "nasrin@example.com",
    area: "Sylhet",
    address: "Sector 3, Jalalabad, Sylhet",
    items: [
      {
        id: 1,
        name: "Golden Damask Wallpaper",
        price: 14000,
        quantity: 1,
        image: "/categories/wallpaper.jpg",
      },
    ],
    total: 22400,
    status: "Pending",
    date: "2024-12-17",
    deliveryDate: "2024-12-23",
    paymentMethod: "Bkash",
    paymentStatus: "Paid",
    notes: "",
  },
  {
    id: "ORD-2024-120",
    customer: "Karim Mia",
    customerId: "CUST-005",
    phone: "01512345678",
    email: "karim@example.com",
    area: "Gazipur",
    address: "Tongi, Gazipur",
    items: [
      {
        id: 1,
        name: "Marble White Epoxy",
        price: 40500,
        quantity: 2,
        image: "/categories/floor.jpg",
      },
    ],
    total: 90000,
    status: "Pending",
    date: "2024-12-16",
    deliveryDate: "2024-12-24",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Unpaid",
    notes: "",
  },
  {
    id: "ORD-2024-119",
    customer: "Sanjida Islam",
    customerId: "CUST-006",
    phone: "01787654321",
    email: "sanjida@example.com",
    area: "Dhaka",
    address: "Banani, Dhaka",
    items: [
      {
        id: 1,
        name: "Modern Geometric Wallpaper",
        price: 15000,
        quantity: 1,
        image: "/categories/wallpaper.jpg",
      },
    ],
    total: 15000,
    status: "Completed",
    date: "2024-12-15",
    deliveryDate: "2024-12-17",
    paymentMethod: "Bkash",
    paymentStatus: "Paid",
    notes: "",
  },
  {
    id: "ORD-2024-118",
    customer: "Tariq Hassan",
    customerId: "CUST-007",
    phone: "01887654321",
    email: "tariq@example.com",
    area: "Cumilla",
    address: "Cumilla town",
    items: [
      {
        id: 1,
        name: "Wooden Texture Epoxy",
        price: 38000,
        quantity: 2,
        image: "/categories/floor.jpg",
      },
    ],
    total: 76000,
    status: "Cancelled",
    date: "2024-12-14",
    deliveryDate: "2024-12-20",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Unpaid",
    notes: "Customer changed their mind",
  },
  {
    id: "ORD-2024-117",
    customer: "Mitu Akter",
    customerId: "CUST-008",
    phone: "01987654321",
    email: "mitu@example.com",
    area: "Narayanganj",
    address: "Fatullah, Narayanganj",
    items: [
      {
        id: 1,
        name: "Vintage Pink Wallpaper",
        price: 12500,
        quantity: 1,
        image: "/categories/bedroom.jpg",
      },
    ],
    total: 12500,
    status: "Completed",
    date: "2024-12-13",
    deliveryDate: "2024-12-15",
    paymentMethod: "Nagad",
    paymentStatus: "Paid",
    notes: "",
  },
];

const formatBDT = (n) => "৳" + Number(n).toLocaleString("en-IN");
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// Generate invoice content
export const generateInvoice = (order) => {
  const invoiceContent = `
================================================================================
                                  RS 3D Wallpaper & Floor
                                  Invoice
================================================================================

Invoice ID: ${order.id}
Date: ${formatDate(order.date)}
Delivery Date: ${formatDate(order.deliveryDate)}

--------------------------------------------------------------------------------
Customer Details
--------------------------------------------------------------------------------
Name: ${order.customer}
Email: ${order.email}
Phone: ${order.phone}
Address: ${order.address}

--------------------------------------------------------------------------------
Items
--------------------------------------------------------------------------------
${order.items
  .map(
    (item, idx) => `
${idx + 1}. ${item.name}
   Price: ${formatBDT(item.price)}
   Quantity: ${item.quantity}
   Total: ${formatBDT(item.price * item.quantity)}
`,
  )
  .join("")}
--------------------------------------------------------------------------------
Subtotal: ${formatBDT(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}
Delivery: Free
Total: ${formatBDT(order.total)}
--------------------------------------------------------------------------------
Payment Method: ${order.paymentMethod}
Payment Status: ${order.paymentStatus}
Order Status: ${order.status}

${order.notes ? `Notes: ${order.notes}\n` : ""}
================================================================================
Thank you for your business!
================================================================================
`;
  return invoiceContent;
};

// Download invoice function
export const downloadInvoice = (order) => {
  const content = generateInvoice(order);
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `invoice-${order.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Download invoice by order ID
export const downloadInvoiceById = (orderId) => {
  const order = ORDER_DETAILS.find((o) => o.id === orderId);
  if (!order) return;
  downloadInvoice(order);
};
