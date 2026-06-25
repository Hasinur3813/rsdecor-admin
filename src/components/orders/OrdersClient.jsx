"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Package,
  Users,
  DollarSign,
  Clock,
  Check,
  Download,
} from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import TablePagination from "@/components/ui/TablePagination";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useTable } from "@/hooks/useTable";
import { ORDER_DETAILS, downloadInvoiceById } from "@/lib/invoice";

// Demo order data - extract from ORDER_DETAILS
const ORDERS = ORDER_DETAILS.map((order) => ({
  id: order.id,
  customer: order.customer,
  phone: order.phone,
  area: order.area,
  items: order.items[0].name,
  total: order.total,
  status: order.status,
  date: order.date,
}));

const formatBDT = (n) => "৳" + Number(n).toLocaleString("en-IN");
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// Calculate stats
const getOrderStats = (orders) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const completedOrders = orders.filter((o) => o.status === "Completed").length;
  return { totalRevenue, totalOrders, pendingOrders, completedOrders };
};

export default function OrdersClient() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Filter orders
  const filteredOrders = ORDERS.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Table hook
  const {
    paginatedData,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
    totalPages,
    setCurrentPage,
    setItemsPerPage,
    handleSort,
  } = useTable({
    data: filteredOrders,
    initialSortBy: "date",
    initialSortOrder: "desc",
    initialItemsPerPage: 5,
  });

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, setCurrentPage]);

  const stats = getOrderStats(filteredOrders);

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              Orders
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage all orders</p>
          </div>
          <Button onClick={() => router.push("/orders/new")}>
            <Plus className="w-4 h-4" />
            New Order
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-heading">
                  {stats.totalOrders}
                </div>
                <div className="text-xs font-medium text-gray-500">
                  Total Orders
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-heading">
                  {stats.pendingOrders}
                </div>
                <div className="text-xs font-medium text-gray-500">Pending</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-heading">
                  {stats.completedOrders}
                </div>
                <div className="text-xs font-medium text-gray-500">
                  Completed
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-heading">
                  {formatBDT(stats.totalRevenue)}
                </div>
                <div className="text-xs font-medium text-gray-500">
                  Total Revenue
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by customer name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  sortable
                  sortKey="id"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Order ID
                </TableHead>
                <TableHead
                  sortable
                  sortKey="customer"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Customer
                </TableHead>
                <TableHead
                  sortable
                  sortKey="items"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Items
                </TableHead>
                <TableHead
                  sortable
                  sortKey="total"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Total
                </TableHead>
                <TableHead
                  sortable
                  sortKey="status"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Status
                </TableHead>
                <TableHead
                  sortable
                  sortKey="date"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Date
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <span className="text-sm font-semibold text-gray-700 font-mono">
                        {order.id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {order.customer}
                        </div>
                        <div className="text-xs text-gray-400">
                          {order.area}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 max-w-[160px] block truncate">
                        {order.items}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold text-gray-800">
                        {formatBDT(order.total)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {formatDate(order.date)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadInvoiceById(order.id);
                          }}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/orders/${order.id}`)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="text-gray-400 text-sm">No orders found</div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredOrders.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(val) => {
              setItemsPerPage(val);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>
    </AdminShell>
  );
}
