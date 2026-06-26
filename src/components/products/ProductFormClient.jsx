"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Toggle from "@/components/ui/Toggle";
import TagsInput from "@/components/ui/TagsInput";
import ImageUpload from "@/components/ui/ImageUpload";
import {
  PRODUCTS,
  CATEGORIES,
  MATERIAL_OPTIONS,
  COLOR_FAMILY_OPTIONS,
  WARRANTY_OPTIONS,
  FINISH_OPTIONS,
} from "@/lib/products";

// Initial form state
const initialFormData = {
  name: "",
  slug: "",
  category: "",
  roomType: "",
  material: "",
  finish: "",
  pricePerSqft: "",
  warranty: "",
  isNew: false,
  isBestSeller: false,
  isFeatured: false,
  colorFamily: "",
  tags: [],
  images: [],
  imageAlt: "",
  description: "",
  stock: "",
  status: "InStock",
};

export default function ProductFormClient() {
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params.id;

  // Find product if editing
  const existingProduct = isEdit
    ? PRODUCTS.find((p) => p.id === params.id)
    : null;

  const [formData, setFormData] = useState(
    existingProduct || initialFormData
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get available categories and room types
  const categoryOptions = CATEGORIES.flatMap((cat) =>
    cat.items.map((item) => ({
      label: item.label,
      value: item.filter.category,
    }))
  );

  // Get unique room types based on selected category
  const getRoomTypeOptions = () => {
    if (!formData.category) return [];
    const roomTypes = [];
    CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => {
        if (
          item.filter.category === formData.category &&
          item.filter.room
        ) {
          roomTypes.push(item.filter.room);
        }
      });
    });
    return [...new Set(roomTypes)];
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleToggle = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.pricePerSqft) newErrors.pricePerSqft = "Price is required";
    if (formData.images.length === 0)
      newErrors.images = "At least one image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(
        isEdit ? "Product updated successfully!" : "Product created successfully!"
      );
      router.push("/products");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/products")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEdit
                ? "Update product information"
                : "Create a new product for your catalog"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                  placeholder="e.g., Royal Floral 3D Wallpaper"
                />
                <Input
                  label="Slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="e.g., royal-floral-3d-wallpaper"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                />
              </div>
            </div>

            {/* Classification */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Classification
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Category"
                  name="category"
                  options={categoryOptions}
                  value={formData.category}
                  onChange={handleChange}
                  error={errors.category}
                  required
                />
                <Select
                  label="Room Type"
                  name="roomType"
                  options={getRoomTypeOptions()}
                  value={formData.roomType}
                  onChange={handleChange}
                  placeholder="Select room type"
                />
                <Select
                  label="Material"
                  name="material"
                  options={MATERIAL_OPTIONS}
                  value={formData.material}
                  onChange={handleChange}
                />
                <Select
                  label="Finish"
                  name="finish"
                  options={FINISH_OPTIONS}
                  value={formData.finish}
                  onChange={handleChange}
                />
                <Select
                  label="Color Family"
                  name="colorFamily"
                  options={COLOR_FAMILY_OPTIONS}
                  value={formData.colorFamily}
                  onChange={handleChange}
                />
                <Select
                  label="Warranty"
                  name="warranty"
                  options={WARRANTY_OPTIONS}
                  value={formData.warranty}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Pricing & Inventory
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Price per Sqft (৳)"
                  name="pricePerSqft"
                  type="number"
                  value={formData.pricePerSqft}
                  onChange={handleChange}
                  error={errors.pricePerSqft}
                  required
                  placeholder="e.g., 140"
                />
                <Input
                  label="Stock Quantity"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="e.g., 45"
                />
              </div>
              <div className="mt-4">
                <Select
                  label="Status"
                  name="status"
                  options={[
                    { label: "In Stock", value: "InStock" },
                    { label: "Low Stock", value: "LowStock" },
                    { label: "Out of Stock", value: "OutOfStock" },
                  ]}
                  value={formData.status}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <TagsInput
                label="Tags"
                tags={formData.tags}
                onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
                placeholder="Type and press Space to add tags"
              />
            </div>
          </div>

          {/* Right Column - Media & Flags */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Images */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <ImageUpload
                label="Product Images"
                images={formData.images}
                onChange={(images) =>
                  setFormData((prev) => ({ ...prev, images }))
                }
                multiple={true}
                maxFiles={10}
                error={errors.images}
              />
              <div className="mt-4">
                <Input
                  label="Image Alt Text"
                  name="imageAlt"
                  value={formData.imageAlt}
                  onChange={handleChange}
                  placeholder="Describe the main image"
                />
              </div>
            </div>

            {/* Product Flags */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Product Flags
              </h3>
              <div className="space-y-4">
                <Toggle
                  label="New Arrival"
                  checked={formData.isNew}
                  onChange={(val) => handleToggle("isNew", val)}
                />
                <Toggle
                  label="Best Seller"
                  checked={formData.isBestSeller}
                  onChange={(val) => handleToggle("isBestSeller", val)}
                />
                <Toggle
                  label="Featured"
                  checked={formData.isFeatured}
                  onChange={(val) => handleToggle("isFeatured", val)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                  ? "Update Product"
                  : "Create Product"}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/products")}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
