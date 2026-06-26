"use client";
import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import {
  getCategoryById,
  getSubcategoryById,
} from "@/lib/categories";

export default function SubcategoryFormClient() {
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params.subcategoryId;
  const fileInputRef = useRef(null);

  const category = getCategoryById(params.id);
  const existingSubcategory = isEdit
    ? getSubcategoryById(params.id, params.subcategoryId)
    : null;

  const [formData, setFormData] = useState(
    existingSubcategory || {
      label: "",
      slug: "",
      totalDesign: "",
      image: "",
      filter: {
        category: "",
      },
    }
  );
  const [imagePreview, setImagePreview] = useState(formData.image || "");

  if (!category) {
    return (
      <AdminShell>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800">
              Category Not Found
            </h2>
            <Button className="mt-4" onClick={() => router.push("/categories")}>
              Back to Categories
            </Button>
          </div>
        </div>
      </AdminShell>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("filter.")) {
      const filterKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        filter: {
          ...prev.filter,
          [filterKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting subcategory:", formData);
    if (typeof toast !== "undefined") {
      toast.success(isEdit ? "Subcategory updated!" : "Subcategory created!");
    }
    router.push(`/categories/${params.id}/subcategories`);
  };

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              router.push(`/categories/${params.id}/subcategories`)
            }
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              {isEdit ? "Edit Subcategory" : "Add Subcategory"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              For category: {category.title}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  placeholder="e.g., 3D Wallpapers"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="e.g., 3d-wallpapers"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Total Designs
                </label>
                <input
                  type="text"
                  name="totalDesign"
                  value={formData.totalDesign}
                  onChange={handleChange}
                  placeholder="e.g., 120"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">
                  Filter Settings
                </h3>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Category Filter
                  </label>
                  <input
                    type="text"
                    name="filter.category"
                    value={formData.filter.category}
                    onChange={handleChange}
                    placeholder="e.g., 3D Wallpaper"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <Button type="submit">
                  {isEdit ? "Update Subcategory" : "Add Subcategory"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/categories/${params.id}/subcategories`)
                  }
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>

          {/* Image Upload */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Subcategory Image
              </h3>

              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl p-8 cursor-pointer transition-all text-center"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG, WEBP up to 5MB
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="aspect-video rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={clearImage}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-gray-600 hover:text-red-500 hover:bg-white shadow-sm flex items-center justify-center transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
