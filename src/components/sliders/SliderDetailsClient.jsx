"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MonitorPlay,
  Image as ImageIcon,
  Tag,
  Link as LinkIcon,
  Calendar,
  Loader2,
  AlertCircle,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { fetchSliderById } from "@/store/slices/sliderSlice";
import { formatDate } from "@/lib/sliders";

const PREVIEW_MODES = [
  { key: "desktop", icon: Monitor, label: "Desktop" },
  { key: "tablet", icon: Tablet, label: "Tablet" },
  { key: "mobile", icon: Smartphone, label: "Mobile" },
];

export default function SliderDetailsClient({ sliderId }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [previewMode, setPreviewMode] = useState("desktop");

  const previewWrapperClass = {
    desktop: "w-full",
    tablet: "w-full max-w-[768px] mx-auto",
    mobile: "w-full max-w-[375px] mx-auto",
  };

  const {
    currentSlider: slider,
    detailLoading,
    detailError,
  } = useSelector((state) => state.slider);

  useEffect(() => {
    if (sliderId) {
      dispatch(fetchSliderById(sliderId));
    }
  }, [dispatch, sliderId]);

  if (detailLoading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm text-gray-500 font-medium">
              Loading slider details...
            </p>
          </div>
        </div>
      </AdminShell>
    );
  }

  if (detailError) {
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
                onClick={() => dispatch(fetchSliderById(sliderId))}
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </AdminShell>
    );
  }

  if (!slider) {
    return (
      <AdminShell>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800">
              Slider Not Found
            </h2>
            <p className="text-gray-500 mt-2">
              The slider you're looking for doesn't exist.
            </p>
            <Button className="mt-4" onClick={() => router.push("/sliders")}>
              Back to Sliders
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
              onClick={() => router.push("/sliders")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-heading text-2xl font-bold text-gray-900">
                {slider.heading}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Slider ID: #{slider.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/sliders/${slider.id}/edit`)}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Slider Preview */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800">Preview</h3>
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
                  {slider.image ? (
                    <img
                      src={slider.image}
                      alt={slider.alt || slider.heading}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <ImageIcon className="w-16 h-16" />
                    </div>
                  )}
                  {/* Overlay content */}
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
                      {slider.badge && (
                        <div className="mb-2 sm:mb-4">
                          <span
                            className={`inline-block px-3 py-1 bg-primary text-white font-semibold rounded-full ${
                              previewMode === "mobile"
                                ? "text-[9px]"
                                : "text-xs"
                            }`}
                          >
                            {slider.badge}
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
                        {slider.heading}
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
                        {slider.subtext}
                      </p>
                      <div
                        className={`flex gap-2 ${
                          previewMode === "mobile" ? "flex-col" : "flex-row"
                        }`}
                      >
                        {slider.cta1?.label && (
                          <button className={`bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors ${
                              previewMode === "mobile"
                                ? "px-3 py-1.5 text-[10px]"
                                : previewMode === "tablet"
                                  ? "px-4 py-2 text-xs"
                                  : "px-6 py-2.5 text-sm"
                            }`}>
                            {slider.cta1.label}
                          </button>
                        )}
                        {slider.cta2?.label && (
                          <button className={`bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-colors ${
                              previewMode === "mobile"
                                ? "px-3 py-1.5 text-[10px]"
                                : previewMode === "tablet"
                                  ? "px-4 py-2 text-xs"
                                  : "px-6 py-2.5 text-sm"
                            }`}>
                            {slider.cta2.label}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Info */}
          <div className="flex flex-col gap-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Slider Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MonitorPlay className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Display Order</div>
                    <div className="text-sm font-semibold text-gray-800">
                      Position #{slider.id}
                    </div>
                  </div>
                </div>

                {slider.badge && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Tag className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Badge</div>
                      <div className="text-sm font-medium text-gray-800">
                        {slider.badge}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Created At</div>
                    <div className="text-sm font-medium text-gray-800">
                      {slider.createdAt ? formatDate(slider.createdAt) : "—"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                CTA Buttons
              </h3>
              <div className="space-y-4">
                {slider.cta1?.label ? (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Button 1</span>
                      <span className="text-xs font-semibold text-primary">
                        Primary
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      {slider.cta1.label}
                    </div>
                    {slider.cta1.href && (
                      <a
                        href={slider.cta1.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:text-primary-dark flex items-center gap-1 mt-1"
                      >
                        <LinkIcon className="w-3 h-3" />
                        {slider.cta1.href}
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No primary button configured.</div>
                )}

                {slider.cta2?.label && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Button 2</span>
                      <span className="text-xs font-semibold text-gray-500">
                        Secondary
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      {slider.cta2.label}
                    </div>
                    {slider.cta2.href && (
                      <a
                        href={slider.cta2.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:text-primary-dark flex items-center gap-1 mt-1"
                      >
                        <LinkIcon className="w-3 h-3" />
                        {slider.cta2.href}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions & Status */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/sliders/${slider.id}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Slider
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Status
                </h3>
                <Badge status={slider.status || "Active"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
