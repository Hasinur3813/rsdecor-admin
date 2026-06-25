"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Users,
  DollarSign,
  UserPlus,
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
import { CUSTOMERS, formatBDT, formatDate } from "@/lib/customers";

// Calculate stats
const getCustomerStats = (customers) => {
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "Active").length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);
  return { totalCustomers, activeCustomers, totalRevenue, totalOrders };
};

export default function CustomersClient() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Filter customers
  const filteredCustomers = CUSTOMERS.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || customer.status === filterStatus;
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
    data: filteredCustomers,
    initialSortBy: "joinedDate",
    initialSortOrder: "desc",
    initialItemsPerPage: 5,
  });

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, setCurrentPage]);

  const stats = getCustomerStats(filteredCustomers);

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              Customers
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage all your customers
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-heading">
                  {stats.totalCustomers}
                </div>
                <div className="text-xs font-medium text-gray-500">
                  Total Customers
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-heading">
                  {stats.activeCustomers}
                </div>
                <div className="text-xs font-medium text-gray-500">
                  Active Customers
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

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
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
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers by name, phone, email, or ID..."
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customers Table */}
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
                  Customer ID
                </TableHead>
                <TableHead
                  sortable
                  sortKey="name"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Name
                </TableHead>
                <TableHead
                  sortable
                  sortKey="phone"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Phone
                </TableHead>
                <TableHead
                  sortable
                  sortKey="area"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Area
                </TableHead>
                <TableHead
                  sortable
                  sortKey="totalOrders"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Total Orders
                </TableHead>
                <TableHead
                  sortable
                  sortKey="totalSpent"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Total Spent
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <span className="text-sm font-semibold text-gray-700 font-mono">
                        {customer.id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            {customer.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {customer.phone}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {customer.area}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-gray-800">
                        {customer.totalOrders}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold text-gray-800">
                        {formatBDT(customer.totalSpent)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge status={customer.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/customers/${customer.id}`)
                          }
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="text-gray-400 text-sm">
                      No customers found
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredCustomers.length}
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
