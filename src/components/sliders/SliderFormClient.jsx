"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";
import toast from "react-hot-toast";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import {
  createSlider,
  updateSlider,
  fetchSliderById,
  resetCreateState,
  resetUpdateState,
  clearCurrentSlider,
} from "@/store/slices/sliderSlice";

const PREVIEW_MODES = [
  { key: "desktop", icon: Monitor, label: "Desktop" },
  { key: "tablet", icon: Tablet, label: "Tablet" },
  { key: "mobile", icon: Smartphone, label: "Mobile" },
];

export default function SliderFormClient({ id }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const isEdit = !!id;
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");

  const {
    currentSlider,
    detailLoading,
    detailError,
    createLoading,
    createError,
    createSuccess,
    updateLoading,
    updateError,
    updateSuccess,
  } = useSelector((state) => state.slider);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      badge: "",
      heading: "",
      subtext: "",
      image: "",
      alt: "",
      cta1: { label: "", href: "" },
      cta2: { label: "", href: "" },
    },
  });

  // ── Fetch existing slider for edit mode ───────────────────────────────────
  useEffect(() => {
    if (isEdit) {
      dispatch(fetchSliderById(id));
    }
    return () => {
      dispatch(clearCurrentSlider());
      dispatch(resetCreateState());
      dispatch(resetUpdateState());
    };
  }, [dispatch, id, isEdit]);

  // ── Populate form when slider data is fetched ─────────────────────────────
  useEffect(() => {
    if (isEdit && currentSlider) {
      reset({
        badge: currentSlider.badge || "",
        heading: currentSlider.heading || "",
        subtext: currentSlider.subtext || "",
        image: currentSlider.image || "",
        alt: currentSlider.alt || "",
        cta1: {
          label: currentSlider.cta1?.label || "",
          href: currentSlider.cta1?.href || "",
        },
        cta2: {
          label: currentSlider.cta2?.label || "",
          href: currentSlider.cta2?.href || "",
        },
      });
    }
  }, [currentSlider, isEdit, reset]);

  // ── Handle create/update success ──────────────────────────────────────────
  useEffect(() => {
    if (createSuccess) {
      toast.success("Slider created successfully!");
      router.push("/sliders");
    }
  }, [createSuccess, router]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Slider updated successfully!");
      router.push("/sliders");
    }
  }, [updateSuccess, router]);

  // ── Handle errors ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (createError) toast.error(createError);
  }, [createError]);

  useEffect(() => {
    if (updateError) toast.error(updateError);
  }, [updateError]);

  // ── Watched values for preview ────────────────────────────────────────────
  const image = watch("image");
  const badge = watch("badge");
  const heading = watch("heading");
  const subtext = watch("subtext");
  const cta1Label = watch("cta1.label");
  const cta2Label = watch("cta2.label");

  // ── File handling ─────────────────────────────────────────────────────────
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
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const clearImage = () => {
    setValue("image", "");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Submit → build FormData & dispatch ────────────────────────────────────
  const onSubmit = (data) => {
    const fd = new FormData();
    fd.append("badge", data.badge || "");
    fd.append("heading", data.heading);
    fd.append("subtext", data.subtext);
    fd.append("alt", data.alt);
    fd.append("cta1[label]", data.cta1?.label || "");
    fd.append("cta1[href]", data.cta1?.href || "");
    fd.append("cta2[label]", data.cta2?.label || "");
    fd.append("cta2[href]", data.cta2?.href || "");

    if (selectedFile) {
      fd.append("image", selectedFile);
    }

    if (isEdit) {
      dispatch(updateSlider({ id, formData: fd }));
    } else {
      dispatch(createSlider(fd));
    }
  };

  const isSubmitting = createLoading || updateLoading;

  // ── Preview responsive wrapper styles ─────────────────────────────────────
  const previewWrapperClass = {
    desktop: "w-full",
    tablet: "w-full max-w-[768px] mx-auto",
    mobile: "w-full max-w-[375px] mx-auto",
  };

  // ── Loading state for edit mode ───────────────────────────────────────────
  if (isEdit && detailLoading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm text-gray-500 font-medium">
              Loading slider…
            </p>
          </div>
        </div>
      </AdminShell>
    );
  }

  // ── Error state for edit mode ─────────────────────────────────────────────
  if (isEdit && detailError) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4 max-w-sm text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-red-500" />
            </div>
            <p className="text-sm text-gray-800 font-semibold">
              Failed to load slider
            </p>
            <p className="text-xs text-gray-500">{detailError}</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/sliders")}
              >
                Go Back
              </Button>
              <Button
                size="sm"
                onClick={() => dispatch(fetchSliderById(id))}
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/sliders")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
              {isEdit ? "Edit Slider" : "Create Slider"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEdit
                ? "Update slider content"
                : "Create a new homepage slider"}
            </p>
          </div>
        </div>

        {/* ── Error banner ────────────────────────────────────────────── */}
        {(createError || updateError) && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{createError || updateError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Form ──────────────────────────────────────────────────── */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 space-y-6"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Badge Text
                </label>
                <input
                  type="text"
                  {...register("badge")}
                  placeholder="e.g., New Collection"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Heading <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("heading", { required: "Heading is required" })}
                  placeholder="Enter slider heading"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                {errors.heading && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.heading.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Subtext <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("subtext", { required: "Subtext is required" })}
                  placeholder="Enter slider subtext"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                />
                {errors.subtext && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.subtext.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Image Alt Text <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("alt", { required: "Alt text is required" })}
                  placeholder="Describe the image for accessibility"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                {errors.alt && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.alt.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Button 1 (Primary)
                  </label>
                  <input
                    type="text"
                    {...register("cta1.label")}
                    placeholder="Button text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all mb-2"
                  />
                  <input
                    type="url"
                    {...register("cta1.href")}
                    placeholder="Button URL"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Button 2 (Secondary)
                  </label>
                  <input
                    type="text"
                    {...register("cta2.label")}
                    placeholder="Button text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all mb-2"
                  />
                  <input
                    type="url"
                    {...register("cta2.href")}
                    placeholder="Button URL"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {isEdit
                    ? isSubmitting
                      ? "Updating…"
                      : "Update Slider"
                    : isSubmitting
                      ? "Creating…"
                      : "Create Slider"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/sliders")}
                  type="button"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>

          {/* ── Right Column: Image Upload + Preview ──────────────────── */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Image Upload */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Background Image
              </h3>

              {!image ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG, WEBP up to 5MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="aspect-video rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={image}
                      alt={watch("alt") || "Preview"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={clearImage}
                    type="button"
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

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Recommended: 1920 x 1080 pixels (16:9)</p>
                  <p>• Use high-quality images for best display</p>
                  <p>• File formats: JPG, PNG, WEBP</p>
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800">
                  Live Preview
                </h3>
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  {PREVIEW_MODES.map(({ key, icon: Icon, label }) => (
                    <button
                      key={key}
                      type="button"
                      title={label}
                      onClick={() => setPreviewMode(key)}
                      className={`p-1.5 rounded-md transition-all ${
                        previewMode === key
                          ? "bg-white shadow-sm text-primary"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`${previewWrapperClass[previewMode]} transition-all duration-300`}
              >
                <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
                  {image ? (
                    <img
                      src={image}
                      alt={watch("alt") || "Preview"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <ImageIcon className="w-16 h-16" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                    <div
                      className={`${
                        previewMode === "mobile"
                          ? "p-3"
                          : previewMode === "tablet"
                            ? "p-5"
                            : "p-8"
                      } max-w-[85%] sm:max-w-md`}
                    >
                      {badge && (
                        <div className="mb-2 sm:mb-4">
                          <span
                            className={`inline-block px-3 py-1 bg-primary text-white font-semibold rounded-full ${
                              previewMode === "mobile"
                                ? "text-[9px]"
                                : "text-xs"
                            }`}
                          >
                            {badge}
                          </span>
                        </div>
                      )}
                      <h2
                        className={`font-bold text-white leading-tight ${
                          previewMode === "mobile"
                            ? "text-sm mb-1"
                            : previewMode === "tablet"
                              ? "text-xl mb-2"
                              : "text-2xl lg:text-3xl mb-3"
                        }`}
                      >
                        {heading || "Slider Heading"}
                      </h2>
                      <p
                        className={`text-white/80 ${
                          previewMode === "mobile"
                            ? "text-[10px] mb-2 line-clamp-2"
                            : previewMode === "tablet"
                              ? "text-xs mb-4"
                              : "text-sm mb-6"
                        }`}
                      >
                        {subtext || "Slider subtext will appear here"}
                      </p>
                      <div
                        className={`flex gap-2 ${
                          previewMode === "mobile" ? "flex-col" : "flex-row"
                        }`}
                      >
                        {cta1Label && (
                          <button
                            type="button"
                            className={`bg-primary text-white font-semibold rounded-lg ${
                              previewMode === "mobile"
                                ? "px-3 py-1.5 text-[10px]"
                                : previewMode === "tablet"
                                  ? "px-4 py-2 text-xs"
                                  : "px-6 py-2.5 text-sm"
                            }`}
                          >
                            {cta1Label}
                          </button>
                        )}
                        {cta2Label && (
                          <button
                            type="button"
                            className={`bg-white/10 text-white font-semibold rounded-lg border border-white/20 ${
                              previewMode === "mobile"
                                ? "px-3 py-1.5 text-[10px]"
                                : previewMode === "tablet"
                                  ? "px-4 py-2 text-xs"
                                  : "px-6 py-2.5 text-sm"
                            }`}
                          >
                            {cta2Label}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center mt-3">
                {previewMode === "desktop"
                  ? "Desktop (1920px)"
                  : previewMode === "tablet"
                    ? "Tablet (768px)"
                    : "Mobile (375px)"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
