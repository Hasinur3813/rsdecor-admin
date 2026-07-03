"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Toggle from "@/components/ui/Toggle";
import TagsInput from "@/components/ui/TagsInput";
import ImageUpload from "@/components/ui/ImageUpload";
import MultiSelect from "@/components/ui/MultiSelect";
import {
  CATEGORY_OPTIONS,
  ROOM_TYPE_OPTIONS,
  FEATURES_OPTIONS,
  MATERIAL_OPTIONS,
  COLOR_FAMILY_OPTIONS,
  WARRANTY_OPTIONS,
  FINISH_OPTIONS,
} from "@/lib/products";

export default function ProductFormClient() {
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params.id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(isEdit);

  // Initialize react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      roomType: "",
      material: "",
      finish: "",
      pricePerSqft: "",
      warranty: "",
      isNewProduct: false,
      isBestSeller: false,
      isFeatured: false,
      colorFamily: "",
      tags: [],
      features: [],
      images: [],
      imageAlt: "",
      description: "",
      stock: "",
      status: "InStock",
    },
  });

  // Fetch product data if editing
  useEffect(() => {
    const fetchProduct = async () => {
      if (!isEdit) return;
      try {
        const response = await axiosInstance.get(`/products/${params.id}`);
        if (response.data?.success) {
          reset(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load product details");
        router.push("/products");
      } finally {
        setIsLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [isEdit, params.id, reset, router]);

  // Get available categories and room types - independent of each other
  const categoryOptions = CATEGORY_OPTIONS;
  const roomTypeOptions = ROOM_TYPE_OPTIONS;

  // Watch name field for auto-slug generation
  const watchedName = watch("name");
  
  // Slugify function to convert product name to URL-friendly slug
  const slugify = (text) => {
    if (!text) return "";
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/&/g, "-and-")
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Auto-generate slug when product name changes ONLY if not editing
  useEffect(() => {
    if (watchedName && !isEdit) {
      const generatedSlug = slugify(watchedName);
      setValue("slug", generatedSlug, { shouldDirty: true });
    }
  }, [watchedName, isEdit, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Create FormData from the form data
      const formData = new FormData();
      
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          // For arrays (like images, tags, features), append each item
          data[key].forEach((item) => {
            formData.append(key, item);
          });
        } else if (typeof data[key] === "boolean") {
          // Convert booleans to strings
          formData.append(key, data[key].toString());
        } else if (data[key] !== null && data[key] !== undefined) {
          // Append standard fields
          formData.append(key, data[key]);
        }
      });

      console.log(formData)

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEdit) {
        await axiosInstance.put(`/products/${params.id}`, formData, config);
        toast.success("Product updated successfully!");
      } else {
        await axiosInstance.post("/products", formData, config);
        toast.success("Product created successfully!");
      }
      router.push("/products");
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-gray-500 text-sm">Loading product details...</p>
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: "Product name is required",
                  }}
                  render={({ field, fieldState }) => (
                    <Input
                      label="Product Name"
                      {...field}
                      error={fieldState.error?.message}
                      required
                      placeholder="e.g., Royal Floral 3D Wallpaper"
                    />
                  )}
                />
                <Controller
                  name="slug"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Slug"
                      {...field}
                      placeholder="e.g., royal-floral-3d-wallpaper"
                      disabled={true}
                    />
                  )}
                />
              </div>
              <div className="mt-4">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Description
                      </label>
                      <textarea
                        {...field}
                        placeholder="Enter product description..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                      />
                    </>
                  )}
                />
              </div>
            </div>

            {/* Classification */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Classification
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="category"
                  control={control}
                  rules={{
                    required: "Category is required",
                  }}
                  render={({ field, fieldState }) => (
                    <Select
                      label="Category"
                      {...field}
                      options={categoryOptions}
                      error={fieldState.error?.message}
                      required
                    />
                  )}
                />
                <Controller
                  name="roomType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Room Type"
                      {...field}
                      options={roomTypeOptions}
                      placeholder="Select room type"
                    />
                  )}
                />
                <Controller
                  name="material"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Material"
                      {...field}
                      options={MATERIAL_OPTIONS}
                    />
                  )}
                />
                <Controller
                  name="finish"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Finish"
                      {...field}
                      options={FINISH_OPTIONS}
                    />
                  )}
                />
                <Controller
                  name="colorFamily"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Color Family"
                      {...field}
                      options={COLOR_FAMILY_OPTIONS}
                    />
                  )}
                />
                <Controller
                  name="warranty"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Warranty"
                      {...field}
                      options={WARRANTY_OPTIONS}
                    />
                  )}
                />
              </div>
              <div className="mt-4">
                <Controller
                  name="features"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      label="Features"
                      options={FEATURES_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select product features"
                    />
                  )}
                />
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Pricing & Inventory
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="pricePerSqft"
                  control={control}
                  rules={{
                    required: "Price is required",
                  }}
                  render={({ field, fieldState }) => (
                    <Input
                      label="Price per Sqft (৳)"
                      type="number"
                      {...field}
                      error={fieldState.error?.message}
                      required
                      placeholder="e.g., 140"
                    />
                  )}
                />
                <Controller
                  name="stock"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Stock Quantity"
                      type="number"
                      {...field}
                      placeholder="e.g., 45"
                    />
                  )}
                />
              </div>
              <div className="mt-4">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Status"
                      {...field}
                      options={[
                        { label: "In Stock", value: "InStock" },
                        { label: "Low Stock", value: "LowStock" },
                        { label: "Out of Stock", value: "OutOfStock" },
                      ]}
                    />
                  )}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TagsInput
                    label="Tags"
                    tags={field.value}
                    onChange={field.onChange}
                    placeholder="Type and press Space to add tags"
                  />
                )}
              />
            </div>
          </div>

          {/* Right Column - Media & Flags */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Images */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <Controller
                name="images"
                control={control}
                rules={{
                  validate: (value) =>
                    value?.length > 0 || "At least one image is required",
                }}
                render={({ field, fieldState }) => (
                  <ImageUpload
                    label="Product Images"
                    images={field.value}
                    onChange={field.onChange}
                    multiple={true}
                    maxFiles={10}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <div className="mt-4">
                <Controller
                  name="imageAlt"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Image Alt Text"
                      {...field}
                      placeholder="Describe the main image"
                    />
                  )}
                />
              </div>
            </div>

            {/* Product Flags */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Product Flags
              </h3>
              <div className="space-y-4">
                <Controller
                  name="isNewProduct"
                  control={control}
                  render={({ field }) => (
                    <Toggle
                      label="New Arrival"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="isBestSeller"
                  control={control}
                  render={({ field }) => (
                    <Toggle
                      label="Best Seller"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="isFeatured"
                  control={control}
                  render={({ field }) => (
                    <Toggle
                      label="Featured"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
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
