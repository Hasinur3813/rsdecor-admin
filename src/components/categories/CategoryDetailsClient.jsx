"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Layers,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { CATEGORIES, formatDate, getCategoryById } from "@/lib/categories";

export default function CategoryDetailsClient() {
  const router = useRouter();
  const params = useParams();

  // Find category by id
  const category = getCategoryById(params.id);

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
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/categories")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-heading text-2xl font-bold text-gray-900">
                {category.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Category ID: {category.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/categories/${category.id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Details */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Hero Image */}
            {category.image && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="aspect-video bg-gray-100">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Info Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Category Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Category Key</div>
                    <div className="text-sm font-mono text-gray-700">
                      {category.key}
                    </div>
                  </div>
                </div>

                {category.label && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Label</div>
                      <div className="text-sm font-medium text-gray-800">
                        {category.label}
                      </div>
                    </div>
                  </div>
                )}

                {category.totalDesign && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Total Designs</div>
                      <div className="text-sm font-medium text-gray-800">
                        {category.totalDesign}
                      </div>
                    </div>
                  </div>
                )}

                {category.description && (
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">
                      Description
                    </div>
                    <p className="text-sm text-gray-700">
                      {category.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Subcategories */}
            {category.items && category.items.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Subcategories ({category.items.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/categories/${category.id}/subcategories`)
                      }
                    >
                      Manage
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/categories/${category.id}/subcategories/new`,
                        )
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Subcategory
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        router.push(
                          `/categories/${category.id}/subcategories/${item.id}/edit`,
                        )
                      }
                      className="p-4 border border-gray-100 rounded-xl hover:border-primary/30 hover:bg-primary/5 cursor-pointer transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.label}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {item.label}
                          </h4>
                          {item.totalDesign && (
                            <p className="text-xs text-gray-500 mt-1">
                              {item.totalDesign} designs
                            </p>
                          )}
                          {item.slug && (
                            <p className="text-xs text-gray-400 font-mono mt-1">
                              {item.slug}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/categories/${category.id}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Category
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    router.push(`/categories/${category.id}/subcategories`)
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Manage Subcategories
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Status
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <Badge status={category.status} />
                </div>
                <div className="text-xs text-gray-500">
                  <p>Created: {formatDate(category.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
