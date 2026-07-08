"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { ArrowLeft, Upload, X, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import {
  fetchCategoryById,
  createCategory,
  updateCategory,
} from "@/lib/categories";

// Helper function to get API error messages
const getApiErrorMessage = (
  error,
  fallbackMessage = "Something went wrong",
) => {
  return error?.response?.data?.message || error?.message || fallbackMessage;
};

export default function CategoryFormClient() {
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params.id;
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loadingCategory, setLoadingCategory] = useState(isEdit);
  const [category, setCategory] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      key: "",
      title: "",
      label: "",
      description: "",
      status: "Active",
      image: "",
    },
  });

  const imagePreview = watch("image");

  // Fetch category data for edit mode
  useEffect(() => {
    if (isEdit) {
      const loadCategory = async () => {
        try {
          const data = await fetchCategoryById(params.id);
          const cat = data.data;
          setCategory(cat);
          reset({
            key: cat.key || "",
            title: cat.title || "",
            label: cat.label || "",
            description: cat.description || "",
            status: cat.status || "Active",
            image: cat.image || "",
          });
        } catch (err) {
          toast.error(getApiErrorMessage(err, "Failed to load category"));
          router.push("/categories");
        } finally {
          setLoadingCategory(false);
        }
      };
      loadCategory();
    }
  }, [isEdit, params.id, reset, router]);

  const processFile = (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue("image", reader.result, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const clearImage = () => {
    setValue("image", "", { shouldValidate: true });
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const applyServerErrors = (message) => {
    const lower = message.toLowerCase();

    if (lower.includes("key")) {
      setError("key", { type: "server", message });
    }
    if (lower.includes("title")) {
      setError("title", { type: "server", message });
    }
    if (lower.includes("image")) {
      setError("image", { type: "server", message });
    }
  };

  const onSubmit = async (data) => {
    setSubmitError("");

    try {
      const formData = new FormData();
      formData.append("key", data.key.trim().toLowerCase());
      formData.append("title", data.title.trim());
      formData.append("label", data.label?.trim() || "");
      formData.append("description", data.description?.trim() || "");
      formData.append("status", data.status || "Active");

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      let response;
      if (isEdit) {
        response = await updateCategory(params.id, formData);
      } else {
        response = await createCategory(formData);
      }

      if (response?.success) {
        toast.success(
          response.message ||
            (isEdit
              ? "Category updated successfully!"
              : "Category created successfully!"),
        );
        router.push("/categories");
      }
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        isEdit
          ? "Failed to update category. Please try again."
          : "Failed to create category. Please try again.",
      );

      setSubmitError(message);
      toast.error(message);
      applyServerErrors(message);
    }
  };

  if (loadingCategory) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 p-6">
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
              {isEdit ? "Edit Category" : "Create Category"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEdit
                ? "Update category details"
                : "Create a new product category"}
            </p>
          </div>
        </div>

        {submitError && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Category Key <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., wallpapers"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                      errors.key
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200"
                    }`}
                    {...register("key", {
                      required: "Category key is required",
                      pattern: {
                        value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                        message:
                          "Use lowercase letters, numbers, and hyphens only",
                      },
                    })}
                  />
                  {errors.key && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.key.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Wallpapers"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                      errors.title
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200"
                    }`}
                    {...register("title", {
                      required: "Title is required",
                      minLength: {
                        value: 2,
                        message: "Title must be at least 2 characters",
                      },
                    })}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Label
                </label>
                <input
                  type="text"
                  placeholder="e.g., New Arrivals"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  {...register("label")}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Enter category description..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  {...register("description")}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Status
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  {...register("status")}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {!isEdit && (
                <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                  Total designs are calculated automatically from products when
                  subcategories are added.
                </p>
              )}

              <input
                type="hidden"
                {...register("image", {
                  validate: () =>
                    selectedFile || imagePreview
                      ? true
                      : "Category image is required",
                })}
              />
              {errors.image && (
                <p className="text-xs text-red-500">{errors.image.message}</p>
              )}

              <div className="flex flex-wrap gap-3 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}
                  {isEdit
                    ? isSubmitting
                      ? "Updating…"
                      : "Update Category"
                    : isSubmitting
                      ? "Creating…"
                      : "Create Category"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/categories")}
                  type="button"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Category Image <span className="text-red-500">*</span>
              </h3>

              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all text-center ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
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
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200">
                    <Image
                      src={imagePreview}
                      alt="Category preview"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      unoptimized={
                        imagePreview.startsWith("data:") ||
                        imagePreview.startsWith("blob:")
                      }
                    />
                  </div>
                  <button
                    type="button"
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
