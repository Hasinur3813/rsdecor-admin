"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
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
import Image from "next/image";

// Demo product data
const PRODUCTS = [
  {
    id: "PRD-001",
    name: "Royal Floral 3D Wallpaper",
    category: "Wallpaper",
    price: 14000,
    stock: 45,
    status: "InStock",
    image: "/categories/wallpaper.jpg",
    addedDate: "2024-11-15",
  },
  {
    id: "PRD-002",
    name: "Ocean Blue Epoxy Floor",
    category: "Epoxy Floor",
    price: 40500,
    stock: 12,
    status: "LowStock",
    image: "/categories/floor.jpg",
    addedDate: "2024-10-20",
  },
  {
    id: "PRD-003",
    name: "Cloud Dream Ceiling Paper",
    category: "Ceiling Paper",
    stock: 78,
    price: 14000,
    status: "InStock",
    image: "/categories/celingpaper.jpg",
    addedDate: "2024-10-05",
  },
  {
    id: "PRD-004",
    name: "Golden Damask Wallpaper",
    category: "Wallpaper",
    price: 14000,
    stock: 0,
    status: "OutOfStock",
    image: "/categories/wallpaper.jpg",
    addedDate: "2024-09-18",
  },
  {
    id: "PRD-005",
    name: "Marble White Epoxy",
    category: "Epoxy Floor",
    price: 40500,
    stock: 23,
    status: "InStock",
    image: "/categories/floor.jpg",
    addedDate: "2024-09-01",
  },
  {
    id: "PRD-006",
    name: "Vintage Pink Wallpaper",
    category: "Wallpaper",
    price: 12500,
    stock: 34,
    status: "InStock",
    image: "/categories/bedroom.jpg",
    addedDate: "2024-08-22",
  },
  {
    id: "PRD-007",
    name: "Wooden Texture Epoxy",
    category: "Epoxy Floor",
    price: 38000,
    stock: 5,
    status: "LowStock",
    image: "/categories/floor.jpg",
    addedDate: "2024-08-10",
  },
  {
    id: "PRD-008",
    name: "Modern Geometric Wallpaper",
    category: "Wallpaper",
    price: 15000,
    stock: 67,
    status: "InStock",
    image: "/categories/wallpaper.jpg",
    addedDate: "2024-07-28",
  },
];

const formatBDT = (n) => "৳" + Number(n).toLocaleString("en-IN");
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function ProductsClient() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Filter products
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || product.status === filterStatus;
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
    data: filteredProducts,
    initialSortBy: "name",
    initialSortOrder: "asc",
    initialItemsPerPage: 5,
  });

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, setCurrentPage]);

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
              {paginatedData.length > 0 ? (
                paginatedData.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={40}
                          height={40}
                          className=" rounded-lg object-cover border border-gray-100"
                        />
                        <div>
                          <div className="text-sm font-semibold text-gray-800">
                            {product.name}
                          </div>
                          <div className="text-xs font-mono text-gray-400">
                            {product.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold text-gray-800">
                        {formatBDT(product.price)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-gray-700">
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge status={product.status} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {formatDate(product.addedDate)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/products/${product.id}`)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/products/${product.id}`)}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
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
            totalItems={filteredProducts.length}
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
