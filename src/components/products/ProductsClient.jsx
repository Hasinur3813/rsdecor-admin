"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Edit, Trash2, Eye, Loader2 } from "lucide-react";
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
import Image from "next/image";
import Toggle from "../ui/Toggle";
import ConfirmModal from "@/components/ui/ConfirmModal";

const formatBDT = (n) => "৳" + Number(n).toLocaleString("en-IN");
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function ProductsClient() {
  const router = useRouter();
  
  const [products, setProducts] = useState([]);
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
  
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, isDeleting: false });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/products", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          status: filterStatus,
          sort: sortBy,
          order: sortOrder
        }
      });
      if (response.data?.success) {
        setProducts(response.data.data);
        setTotalItems(response.data.pagination.totalItems);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, filterStatus, sortBy, sortOrder]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
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

  const handleStatusChange = async (id, currentIsActive) => {
    console.log(id, currentIsActive);
    // If currentIsActive is undefined (older product), default it to true and toggle to false.
    const currentActiveState = currentIsActive !== false;
    const newActiveState = !currentActiveState;
    
    // Optimistic update
    setProducts((prev) => 
      prev.map((p) => (p._id === id ? { ...p, isActive: newActiveState } : p))
    );

    try {
      await axiosInstance.patch(`/products/${id}`, { isActive: currentIsActive }, {});
       fetchProducts(); 
      toast.success(!newActiveState ? "Product activated" : "Product deactivated");
    } catch (error) {
      console.log(error)
      toast.error("Failed to update status");
      fetchProducts(); // Revert on failure
    }
  };

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, productId: id, isDeleting: false });
  };

  const confirmDelete = async () => {
    if (!deleteModal.productId) return;
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));
    try {
      await axiosInstance.delete(`/products/${deleteModal.productId}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setDeleteModal({ isOpen: false, productId: null, isDeleting: false });
    }
  };

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              Products
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your product catalog
            </p>
          </div>
          <Button onClick={() => router.push("/products/new")}>
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or ID..."
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
                <option value="InStock">In Stock</option>
                <option value="LowStock">Low Stock</option>
                <option value="OutOfStock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  sortable
                  sortKey="name"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Product
                </TableHead>
                <TableHead
                  sortable
                  sortKey="category"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Category
                </TableHead>
                <TableHead
                  sortable
                  sortKey="price"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Price
                </TableHead>
                <TableHead
                  sortable
                  sortKey="stock"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Stock
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
                  sortKey="addedDate"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Added
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <p className="text-gray-500 text-sm">Loading products...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded-lg object-cover border border-gray-100 min-w-[40px] h-[40px]"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-gray-400">
                            N/A
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-semibold text-gray-800">
                            {product.name}
                          </div>
                          <div className="text-xs font-mono text-gray-400">
                            {product.productId || product._id.substring(0,8)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {product.category || "Uncategorized"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold text-gray-800">
                        {formatBDT(product.pricePerSqft || 0)}
                      </span>
                    </TableCell>
               <TableCell>  <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
        product.stock <= 10
          ? 'bg-red-50 text-red-800 border-red-200 animate-pulse'
          : product.stock < 20
          ? 'bg-amber-50 text-amber-800 border-amber-200'
          : 'bg-teal-50 text-teal-800 border-teal-200'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          product.stock <=10
            ? 'bg-red-600'
            : product.stock <= 20
            ? 'bg-amber-600'
            : 'bg-teal-600'
        }`}
      />
      {product.stock ?? 0} {product.stock === 1 ? 'unit' : 'units'}
    </div>
                    </TableCell>
                    {/* product status changing toggle */}
                    <TableCell>
                    <Toggle checked={product.isActive} onChange={(checked) => handleStatusChange(product._id, checked)} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {product.createdAt ? formatDate(product.createdAt) : "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/products/${product._id}`)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/products/${product._id}/edit`)}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="text-gray-400 text-sm">
                      No products found
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
        onClose={() => !deleteModal.isDeleting && setDeleteModal({ isOpen: false, productId: null, isDeleting: false })}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
      />
    </AdminShell>
  );
}
