"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Tag,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
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
import ConfirmModal from "@/components/ui/ConfirmModal";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatBDT = (n) => "৳" + Number(n).toLocaleString("en-IN");

export default function CouponsClient() {
  const router = useRouter();

  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // API filters & pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    couponId: null,
    isDeleting: false,
  });

  const fetchCoupons = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/coupons", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          status: filterStatus,
          sort: sortBy,
          order: sortOrder,
        },
      });
      if (response.data?.success) {
        setCoupons(response.data.data);
        setTotalItems(response.data.pagination.totalItems);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      toast.error("Failed to load coupons");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, filterStatus, sortBy, sortOrder]);

  useEffect(() => {
    setTimeout(() => fetchCoupons(), 0);
  }, [fetchCoupons]);

  // Reset page when filter/search changes
  useEffect(() => {
    setTimeout(() => setCurrentPage(1), 0);
  }, [searchTerm, filterStatus]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, couponId: id, isDeleting: false });
  };

  const confirmDelete = async () => {
    if (!deleteModal.couponId) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      await axiosInstance.delete(`/coupons/${deleteModal.couponId}`);
      toast.success("Coupon deleted successfully");
      fetchCoupons();
    } catch (error) {
      toast.error("Failed to delete coupon");
    } finally {
      setDeleteModal({ isOpen: false, couponId: null, isDeleting: false });
    }
  };

  const getDiscountDisplay = (coupon) => {
    if (coupon.type === "percentage") {
      return `${coupon.value}% OFF`;
    }
    return formatBDT(coupon.value);
  };

  // Calculate stats
  const stats = {
    totalCoupons: totalItems,
    activeCoupons: coupons.filter((c) => c.status === "Active").length,
    totalUsage: coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0),
  };

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              Coupons
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage discount coupons for your store
            </p>
          </div>
          <Button onClick={() => router.push("/coupons/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Create Coupon
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Tag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-heading">
                  {stats.totalCoupons}
                </div>
                <div className="text-xs font-medium text-gray-500">
                  Total Coupons
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-heading">
                  {stats.activeCoupons}
                </div>
                <div className="text-xs font-medium text-gray-500">
                  Active Coupons
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-heading">
                  {stats.totalUsage}
                </div>
                <div className="text-xs font-medium text-gray-500">
                  Total Usage
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
                placeholder="Search coupons by code or description..."
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
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  sortable
                  sortKey="code"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Code
                </TableHead>
                <TableHead
                  sortable
                  sortKey="value"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Discount
                </TableHead>
                <TableHead
                  sortable
                  sortKey="usedCount"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Usage
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
                  sortKey="endDate"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Expires
                </TableHead>
                <TableCell className="text-right">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <p className="text-gray-500 text-sm">
                        Loading coupons...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <TableRow key={coupon._id}>
                    <TableCell>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-primary font-mono">
                          {coupon.code}
                        </span>
                        <span className="text-xs text-gray-500 truncate max-w-[200px]">
                          {coupon.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold text-gray-800">
                        {getDiscountDisplay(coupon)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-800">
                        {coupon.usedCount || 0} / {coupon.usageLimit}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge status={coupon.status} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {formatDate(coupon.endDate)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/coupons/${coupon._id}`)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/coupons/${coupon._id}/edit`)
                          }
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(coupon._id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="text-gray-400 text-sm">
                      No coupons found
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
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(val) => {
              setItemsPerPage(val);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        isLoading={deleteModal.isDeleting}
        onClose={() =>
          !deleteModal.isDeleting &&
          setDeleteModal({ isOpen: false, couponId: null, isDeleting: false })
        }
        onConfirm={confirmDelete}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon? This action cannot be undone."
        confirmText="Delete"
      />
    </AdminShell>
  );
}
