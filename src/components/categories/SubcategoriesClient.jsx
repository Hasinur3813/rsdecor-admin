"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Search,
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
import { CATEGORIES, getCategoryById } from "@/lib/categories";

export default function SubcategoriesClient() {
  const router = useRouter();
  const params = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const category = getCategoryById(params.id);

  // Filter subcategories
  const filteredSubcategories = (category?.items || []).filter((sub) =>
    sub.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
    data: filteredSubcategories,
    initialSortBy: "label",
    initialSortOrder: "asc",
    initialItemsPerPage: 8,
  });

  if (!category) {
    return (
      <AdminShell>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800">
              Category Not Found
            </h2>
            <p className="text-gray-500 mt-2">
              The category you're looking for doesn't exist.
            </p>
            <Button className="mt-4" onClick={() => router.push("/categories")}>
              Back to Categories
            </Button>
          </div>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/categories/${category.id}`)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              Manage Subcategories
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {category.title} subcategories
            </p>
          </div>
          <div className="ml-auto">
            <Button
              onClick={() =>
                router.push(`/categories/${category.id}/subcategories/new`)
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Subcategory
            </Button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search subcategories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Subcategories Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {paginatedData.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead
                      sortable
                      sortKey="label"
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    >
                      Label
                    </TableHead>
                    <TableHead
                      sortable
                      sortKey="slug"
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    >
                      Slug
                    </TableHead>
                    <TableHead
                      sortable
                      sortKey="totalDesign"
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    >
                      Total Designs
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((subcategory) => (
                    <TableRow key={subcategory.id}>
                      <TableCell>
                        <div className="w-12 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                          {subcategory.image ? (
                            <img
                              src={subcategory.image}
                              alt={subcategory.label}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-gray-800">
                          {subcategory.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-mono text-gray-600">
                          {subcategory.slug}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-700">
                          {subcategory.totalDesign}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/categories/${category.id}/subcategories/${subcategory.id}/edit`,
                              )
                            }
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
                  ))}
                </TableBody>
              </Table>
              <div className="p-4 border-t border-gray-100">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <ImageIcon className="w-10 h-10 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400 text-sm">No subcategories found</p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
