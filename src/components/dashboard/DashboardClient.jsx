"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Clock,
  MessageSquare,
  Megaphone,
  ArrowUpRight,
  Eye,
  Phone,
  RefreshCw,
  Plus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const STATS = [
  {
    label: "Total Revenue",
    value: "৳12,48,500",
    sub: "This month",
    trend: "+18% vs last month",
    trendUp: true,
    icon: "TrendingUp",
    iconBg: "bg-orange-50",
    iconColor: "text-primary",
  },
  {
    label: "Total Orders",
    value: "124",
    sub: "48 this month",
    trend: "+12% vs last month",
    trendUp: true,
    icon: "ShoppingBag",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    label: "Total Customers",
    value: "318",
    sub: "22 new this month",
    trend: "+8% vs last month",
    trendUp: true,
    icon: "Users",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    label: "Pending Orders",
    value: "9",
    sub: "Needs attention",
    trend: "-3 vs last week",
    trendUp: false,
    icon: "Clock",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    label: "Open Enquiries",
    value: "17",
    sub: "5 new today",
    trend: "+5 vs yesterday",
    trendUp: false,
    icon: "MessageSquare",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
  {
    label: "Broadcasts Sent",
    value: "8",
    sub: "This month",
    trend: "1,240 subscribers reached",
    trendUp: true,
    icon: "Megaphone",
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
];

const REVENUE_DATA = [
  { month: "Jul", revenue: 62000, orders: 18 },
  { month: "Aug", revenue: 84000, orders: 24 },
  { month: "Sep", revenue: 71000, orders: 20 },
  { month: "Oct", revenue: 95000, orders: 31 },
  { month: "Nov", revenue: 118000, orders: 38 },
  { month: "Dec", revenue: 143000, orders: 45 },
  { month: "Jan", revenue: 107000, orders: 34 },
  { month: "Feb", revenue: 132000, orders: 42 },
  { month: "Mar", revenue: 156000, orders: 51 },
  { month: "Apr", revenue: 124000, orders: 39 },
  { month: "May", revenue: 178000, orders: 57 },
  { month: "Jun", revenue: 198000, orders: 62 },
];

const CATEGORY_DATA = [
  { name: "3D Wallpaper", value: 58, color: "#C8956C" },
  { name: "Ceiling Paper", value: 24, color: "#4A7C6F" },
  { name: "Epoxy Floor", value: 18, color: "#3b82f6" },
];

const RECENT_ORDERS = [
  {
    id: "ORD-2024-124",
    customer: "Raihan Ahmed",
    area: "Dhaka",
    items: "Royal Floral Wallpaper",
    total: 33600,
    status: "Completed",
    date: "2024-12-20",
  },
  {
    id: "ORD-2024-123",
    customer: "Fatema Begum",
    area: "Chittagong",
    items: "Ocean Blue Epoxy",
    total: 81000,
    status: "In Progress",
    date: "2024-12-19",
  },
  {
    id: "ORD-2024-122",
    customer: "Sabbir Hossain",
    area: "Rajshahi",
    items: "Cloud Dream Ceiling",
    total: 16800,
    status: "Confirmed",
    date: "2024-12-18",
  },
  {
    id: "ORD-2024-121",
    customer: "Nasrin Akter",
    area: "Sylhet",
    items: "Golden Damask Wallpaper",
    total: 22400,
    status: "Pending",
    date: "2024-12-17",
  },
  {
    id: "ORD-2024-120",
    customer: "Karim Mia",
    area: "Gazipur",
    items: "Marble White Epoxy",
    total: 90000,
    status: "Pending",
    date: "2024-12-16",
  },
];

const RECENT_ENQUIRIES = [
  {
    name: "Sanjida Islam",
    phone: "01712345678",
    area: "Dhaka",
    service: "3D Wallpaper",
    time: "10 min ago",
    status: "New",
  },
  {
    name: "Tariq Hassan",
    phone: "01812345678",
    area: "Cumilla",
    service: "Epoxy Floor",
    time: "1 hour ago",
    status: "New",
  },
  {
    name: "Mitu Akter",
    phone: "01912345678",
    area: "Narayanganj",
    service: "Ceiling Paper",
    time: "3 hours ago",
    status: "Replied",
  },
  {
    name: "Rafiqul Islam",
    phone: "01612345678",
    area: "Bogura",
    service: "3D Wallpaper",
    time: "5 hours ago",
    status: "New",
  },
];

const TOP_PRODUCTS = [
  {
    name: "Royal Floral 3D Wallpaper",
    category: "Wallpaper",
    sold: 38,
    revenue: 532000,
    gradient: ["#C8956C", "#D4B896"],
  },
  {
    name: "Ocean Blue Epoxy Floor",
    category: "Epoxy Floor",
    sold: 22,
    revenue: 891000,
    gradient: ["#1e3a5f", "#4A7C6F"],
  },
  {
    name: "Cloud Dream Ceiling Paper",
    category: "Ceiling Paper",
    sold: 31,
    revenue: 434400,
    gradient: ["#b8d4e8", "#e8f4fd"],
  },
  {
    name: "Golden Damask Wallpaper",
    category: "Wallpaper",
    sold: 27,
    revenue: 378000,
    gradient: ["#c9a84c", "#D4B896"],
  },
  {
    name: "Marble White Epoxy",
    category: "Epoxy Floor",
    sold: 19,
    revenue: 769500,
    gradient: ["#e8e8e8", "#c0c0c0"],
  },
];

const ICON_MAP = {
  TrendingUp,
  ShoppingBag,
  Users,
  Clock,
  MessageSquare,
  Megaphone,
};

const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  "In Progress": "bg-orange-100 text-orange-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
  New: "bg-blue-100 text-blue-700",
  Replied: "bg-green-100 text-green-700",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full 
    text-xs font-semibold ${STATUS_STYLES[status] || "bg-gray-100 text-gray-600"}`}
  >
    {status}
  </span>
);

const formatBDT = (n) => "৳" + Number(n).toLocaleString("en-IN");
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "revenue" ? formatBDT(p.value) : `${p.value} orders`}
        </p>
      ))}
    </div>
  );
};

export default function DashboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("revenue");

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, Rasel. Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            {new Date().toLocaleDateString("en-BD", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            onClick={() => window.location.reload()}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STATS.map((stat) => {
          const Icon = ICON_MAP[stat.icon];
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg}`}
                >
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${stat.trendUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}
                >
                  {stat.trend}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-3 font-heading">
                {stat.value}
              </div>
              <div className="text-xs font-medium text-gray-500 mt-0.5">
                {stat.label}
              </div>
              <div className="text-[11px] text-gray-400 mt-1">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue/Orders Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                Revenue Overview
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Last 12 months performance
              </p>
            </div>
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => setActiveTab("revenue")}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${activeTab === "revenue" ? "bg-white shadow-sm text-gray-800" : "text-gray-500 cursor-pointer"}`}
              >
                Revenue
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${activeTab === "orders" ? "bg-white shadow-sm text-gray-800" : "text-gray-500 cursor-pointer"}`}
              >
                Orders
              </button>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === "revenue" ? (
                <AreaChart
                  data={REVENUE_DATA}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#C8956C" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#C8956C" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis width={0} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#C8956C"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              ) : (
                <BarChart
                  data={REVENUE_DATA}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis width={0} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orders" fill="#C8956C" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800">
            Sales by Category
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Product category distribution
          </p>
          <div className="h-44 relative mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-bold text-xl text-gray-800">62</span>
              <span className="text-xs text-gray-400">Orders</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            {CATEGORY_DATA.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{cat.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-800">
                    {cat.value}%
                  </span>
                  <div className="w-16 h-1.5 rounded-full bg-gray-100 mt-0.5">
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: cat.color,
                        width: `${cat.value}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            Recent Orders
          </h3>
          <button
            onClick={() => router.push("/orders")}
            className="text-sm text-primary hover:underline"
          >
            View All →
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  Order
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  Customer
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  Items
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  Total
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  Date
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4 font-mono text-sm font-bold text-gray-700">
                    {order.id}
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-gray-800">
                      {order.customer}
                    </div>
                    <div className="text-xs text-gray-400">{order.area}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 max-w-[160px] truncate">
                    {order.items}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                    {formatBDT(order.total)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden flex flex-col divide-y divide-gray-100">
          {RECENT_ORDERS.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4"
            >
              <div>
                <div className="font-mono text-xs font-bold text-gray-700">
                  {order.id}
                </div>
                <div className="text-sm text-gray-600 mt-0.5">
                  {order.customer}, {order.area}
                </div>
                <div className="text-sm font-semibold text-primary mt-1">
                  {formatBDT(order.total)}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={order.status} />
                <button
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="text-xs text-primary hover:underline"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-800">
              Recent Enquiries
            </h3>
            <button
              onClick={() => router.push("/enquiries")}
              className="text-sm text-primary hover:underline"
            >
              View All →
            </button>
          </div>
          <div className="flex flex-col divide-y divide-gray-100">
            {RECENT_ENQUIRIES.map((enq, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 p-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-gray-800">
                      {enq.name}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {enq.time}
                    </span>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 w-fit mt-1 inline-block">
                    {enq.service}
                  </span>
                  <div className="text-xs text-gray-400 mt-0.5">{enq.area}</div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <StatusBadge status={enq.status} />
                  <a
                    href={`tel:${enq.phone}`}
                    className="w-7 h-7 rounded-lg bg-green-50 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-800">
              Top Products
            </h3>
            <span className="text-xs text-gray-400">By revenue</span>
          </div>
          <div className="flex flex-col divide-y divide-gray-100">
            {TOP_PRODUCTS.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors"
              >
                <span className="text-lg font-bold text-gray-200 w-6 shrink-0 text-center">
                  {idx + 1}
                </span>
                <div
                  className="w-10 h-10 rounded-xl shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})`,
                  }}
                ></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">
                    {p.name}
                  </div>
                  <div className="text-xs text-gray-400">{p.category}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-gray-800">
                    {formatBDT(p.revenue)}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {p.sold} sold
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Strip */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm font-semibold text-gray-600">
            Quick Actions:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => router.push("/products/new")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
            <button
              onClick={() => router.push("/orders")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              View Orders
            </button>
            <button
              onClick={() => router.push("/broadcasts")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-green-50 text-green-600 hover:bg-green-100 transition-all"
            >
              <Megaphone className="w-4 h-4" />
              Send Broadcast
            </button>
            <button
              onClick={() => router.push("/enquiries")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              View Enquiries
            </button>
            <a
              href="https://wa.me/+8801772132818"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-all"
            >
              <Phone className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
