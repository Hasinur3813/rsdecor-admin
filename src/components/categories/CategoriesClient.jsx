/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  LayoutGrid,
  List,
  Image as ImageIcon,
  Layers,
  Loader2,
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
import Toggle from "@/components/ui/Toggle";
import { useTable } from "@/hooks/useTable";
import {
  fetchCategories,
  formatDate,
  patchCategory,
  deleteCategory,
} from "@/lib/categories";
import toast from "react-hot-toast";

export default function CategoriesClient() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewMode, setViewMode] = useState("list");
  const [categoriesData, setCategoriesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingIds, setUpdatingIds] = useState(new Set()); // For optimistic UI

  // Table hook using data from API
  const {
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
    totalPages,
    setCurrentPage,
    setItemsPerPage,
    handleSort,
  } = useTable({
    data: categoriesData?.data || [],
    initialSortBy: "title",
    initialSortOrder: "asc",
    initialItemsPerPage: 5,
  });

  // Fetch categories from API
  const loadCategories = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm,
        status: filterStatus,
        page: currentPage,
        limit: itemsPerPage,
        sort: sortBy,
        order: sortOrder,
      };
      const data = await fetchCategories(params);
      setCategoriesData(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch categories");
      toast.error(err.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce API call to prevent excessive re-renders and cascading state updates
    const timerId = setTimeout(() => {
      loadCategories();
    }, 300);

    // Cleanup previous timer to avoid outdated API calls
    return () => clearTimeout(timerId);
  }, [searchTerm, filterStatus]);

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, setCurrentPage]);

  // Reload when pagination/sort changes
  useEffect(() => {
    // Debounce API call to prevent excessive re-renders and cascading state updates
    const timerId = setTimeout(() => {
      loadCategories();
    }, 300);

    // Cleanup previous timer to avoid outdated API calls
    return () => clearTimeout(timerId);
  }, [currentPage, itemsPerPage, sortBy, sortOrder]);

  // Handle delete category
  const handleDelete = async (categoryId) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(categoryId);
      toast.success("Category deleted successfully");
      loadCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  // Handle updating category status with optimistic UI
  const updateCategoryStatus = async (categoryId, newStatus) => {
    // Optimistic update
    setCategoriesData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        data: prev.data.map((cat) => {
          if (cat.id === categoryId) {
            return { ...cat, status: newStatus };
          }
          return cat;
        }),
      };
    });
    setUpdatingIds((prev) => new Set(prev).add(categoryId));

    try {
      await patchCategory(categoryId, { status: newStatus });
      toast.success(`Category ${newStatus.toLowerCase()} successfully`);
    } catch (err) {
      // Revert optimistic update on error
      setCategoriesData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: prev.data.map((cat) => {
            if (cat.id === categoryId) {
              return {
                ...cat,
                status: newStatus === "Active" ? "Inactive" : "Active",
              };
            }
            return cat;
          }),
        };
      });
      toast.error(err.response?.data?.message || "Failed to update category");
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(categoryId);
        loadCategories();
        return next;
      });
    }
  };

  // Calculate stats from API response
  const stats = {
    totalCategories: categoriesData?.totalCategories || 0,
    activeCategories: categoriesData?.activeCategories || 0,
    totalSubcategories: categoriesData?.totalSubcategories || 0,
  };

  const paginatedData = categoriesData?.data || [];
  const apiTotalPages = categoriesData?.pagination?.totalPages || 1;
  const apiCurrentPage = categoriesData?.pagination?.currentPage || 1;

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              Categories
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your product categories and subcategories
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <Button onClick={() => router.push("/categories/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Create Category
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-heading">
                  {stats.totalCategories}
                </div>
                <div className="text-xs font-medium text-gray-500">
                  Total Categories
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Layers className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-heading">
                  {stats.activeCategories}
                </div>
                <div className="text-xs font-medium text-gray-500">
                  Active Categories
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-heading">
                  {stats.totalSubcategories}
                </div>
                <div className="text-xs font-medium text-gray-500">
                  Total Subcategories
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
                placeholder="Search categories..."
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

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : /* Categories View */
        viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedData.length > 0 ? (
              paginatedData.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group"
                >
                  <div className="relative aspect-video bg-gray-100">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-10 h-10" />
                      </div>
                    )}
                    {/* Status Toggle */}
                    <div className="absolute top-3 right-3">
                      <Toggle
                        checked={category.status === "Active"}
                        onChange={(newChecked) => {
                          updateCategoryStatus(
                            category.id,
                            newChecked ? "Active" : "Inactive",
                          );
                        }}
                        disabled={updatingIds.has(category.id)}
                      />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {category.title}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">
                          {category.items?.length || 0} subcategories
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDate(category.createdAt)}
                      </span>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          router.push(`/categories/${category.id}`)
                        }
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          router.push(`/categories/${category.id}/edit`)
                        }
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  <Layers className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-sm">No categories found</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          // List View (with reusable table components)
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {paginatedData.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        sortable
                        sortKey="title"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                      >
                        Category
                      </TableHead>
                      <TableHead
                        sortable
                        sortKey="key"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                      >
                        Key
                      </TableHead>
                      <TableHead
                        sortable
                        sortKey="items"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                      >
                        Subcategories
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
                        sortKey="createdAt"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                      >
                        Created
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0 relative">
                              {category.image ? (
                                <Image
                                  src={category.image}
                                  alt={category.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <ImageIcon className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900">
                                {category.title}
                              </p>
                              {category.description && (
                                <p className="text-xs text-gray-500 truncate max-w-xs">
                                  {category.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono text-gray-600">
                            {category.key}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700">
                            {category.items?.length || 0}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Toggle
                            checked={category.status === "Active"}
                            onChange={(newChecked) => {
                              updateCategoryStatus(
                                category.id,
                                newChecked ? "Active" : "Inactive",
                              );
                            }}
                            disabled={updatingIds.has(category.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-500">
                            {formatDate(category.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(`/categories/${category.id}`)
                              }
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(`/categories/${category.id}/edit`)
                              }
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(category.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="p-4 border-t border-gray-100">
                  <TablePagination
                    currentPage={apiCurrentPage}
                    totalPages={apiTotalPages}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                  />
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <Layers className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-400 text-sm">No categories found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
