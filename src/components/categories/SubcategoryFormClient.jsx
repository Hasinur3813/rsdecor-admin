"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import {
  fetchCategoryById,
  createSubcategory,
  updateSubcategory,
} from "@/lib/categories";

const getApiErrorMessage = (
  error,
  fallbackMessage = "Something went wrong",
) => {
  return error?.response?.data?.message || error?.message || fallbackMessage;
};

export default function SubcategoryFormClient() {
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params.subcategoryId;
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);

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
      label: "",
      slug: "",
      image: "",
    },
  });

  const imagePreview = watch("image");
  const currentLabel = watch("label");

  // Auto-generate slug from label
  useEffect(() => {
    if (currentLabel) {
      const slug = currentLabel
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [currentLabel, setValue]);

  // Fetch category data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCategoryById(params.id);
        const cat = data.data;

        setCategory(cat);
        if (isEdit) {
          const sub = cat.items.find(
            (s) =>
              s.id === params.subcategoryId ||
              s.subcategoryId === params.subcategoryId,
          );
          if (sub) {
            reset({
              label: sub.label || "",
              slug: sub.slug || "",
              totalDesign: sub.totalDesign || "",
              image: sub.image || "",
              "filter.category": sub.filter?.category || "",
              "filter.room": sub.filter?.room || "",
              "filter.finish": sub.filter?.finish || "",
            });
          } else {
            toast.error("Subcategory not found");
            router.push(`/categories/${params.id}/subcategories`);
          }
        }
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Failed to load category"));
        router.push("/categories");
      } finally {
        setLoadingCategory(false);
      }
    };
    loadData();
  }, [isEdit, params.id, params.subcategoryId, reset, router]);

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

  const onSubmit = async (data) => {
    setSubmitError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("label", data.label.trim());
      formData.append("slug", data.slug.trim().toLowerCase());
      formData.append("filter.category", category.key);
      formData.append("filter.room", data.label.trim());
      if (data.filter?.finish) {
        formData.append("filter.finish", data.filter.finish.trim());
      }

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      let response;
      if (isEdit) {
        response = await updateSubcategory(
          params.id,
          params.subcategoryId,
          formData,
        );
      } else {
        response = await createSubcategory(params.id, formData);
        // console.log(formData);
      }

      if (response?.success) {
        toast.success(
          response.message ||
            (isEdit
              ? "Subcategory updated successfully!"
              : "Subcategory created successfully!"),
        );
        router.push(`/categories/${params.id}/subcategories`);
      }
    } catch (err) {
      const msg = getApiErrorMessage(
        err,
        isEdit
          ? "Failed to update subcategory. Please try again."
          : "Failed to create subcategory. Please try again.",
      );
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
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

        {submitError && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., 3D Wallpapers"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  {...register("label", {
                    required: "Label is required",
                    minLength: {
                      value: 2,
                      message: "Label must be at least 2 characters",
                    },
                  })}
                />
                {errors.label && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.label.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., 3d-wallpapers"
                  disabled
                  className="disabled:cursor-not-allowed disabled:opacity-50 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                  {...register("slug", {
                    required: "Slug is required",
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message:
                        "Use lowercase letters, numbers, and hyphens only",
                    },
                  })}
                />
                {errors.slug && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.slug.message}
                  </p>
                )}
              </div>
              {/* 
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Total Designs
                </label>
                <input
                  type="text"
                  placeholder="e.g., 120"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  {...register("totalDesign")}
                />
              </div> */}

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">
                  Filter Settings
                </h3>
                <div className="space-y-4">
                  {/* <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Category Filter
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 3D Wallpaper"
                      disabled
                      className="disabled:cursor-not-allowed disabled:opacity-50 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      {...register("filter.category")}
                    />
                  </div> */}
                  {/* <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Room Filter
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Living Room"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      {...register("filter.room")}
                    />
                  </div> */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Finish Filter
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Matte"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      {...register("filter.finish")}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <Button type="submit" disabled={isSubmitting || loading}>
                  {(isSubmitting || loading) && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}
                  {isEdit ? "Update Subcategory" : "Add Subcategory"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/categories/${params.id}/subcategories`)
                  }
                  type="button"
                  disabled={isSubmitting || loading}
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
                      alt="Subcategory preview"
                      fill
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
