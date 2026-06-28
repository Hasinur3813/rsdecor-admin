"use client";
import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  MonitorPlay,
} from "lucide-react";
import toast from "react-hot-toast";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import { SLIDERS, getSliderById } from "@/lib/sliders";

export default function SliderFormClient({ id }) {
  const router = useRouter();
  // const params = useParams();
  const isEdit = !!id;
  const fileInputRef = useRef(null);

  // Initial form data
  const initialData = isEdit
    ? getSliderById(id) || {
        badge: "",
        title: "",
        subtitle: "",
        bgImage: "",
        button1Text: "",
        button1Url: "",
        button2Text: "",
        button2Url: "",
        order: 1,
        status: "Active",
      }
    : {
        badge: "",
        title: "",
        subtitle: "",
        bgImage: "",
        button1Text: "",
        button1Url: "",
        button2Text: "",
        button2Url: "",
        order: SLIDERS.length + 1,
        status: "Active",
      };

  const [formData, setFormData] = useState(initialData);
  const [imagePreview, setImagePreview] = useState(initialData.bgImage);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
          bgImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

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
          bgImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview("");
    setFormData((prev) => ({
      ...prev,
      bgImage: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting slider:", formData);
    if (typeof toast !== "undefined") {
      toast.success(isEdit ? "Slider updated!" : "Slider created!");
    }
    router.push("/sliders");
  };

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
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
              {isEdit ? "Edit Slider" : "Create Slider"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEdit
                ? "Update slider content"
                : "Create a new homepage slider"}
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
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Badge Text
                </label>
                <input
                  type="text"
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  placeholder="e.g., New Collection"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter slider title"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Subtitle <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="Enter slider subtitle"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  placeholder="1"
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              {isEdit && (
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              )}

              {/* Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Button 1 (Primary)
                  </label>
                  <input
                    type="text"
                    name="button1Text"
                    value={formData.button1Text}
                    onChange={handleChange}
                    placeholder="Button text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all mb-2"
                  />
                  <input
                    type="url"
                    name="button1Url"
                    value={formData.button1Url}
                    onChange={handleChange}
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
                    name="button2Text"
                    value={formData.button2Text}
                    onChange={handleChange}
                    placeholder="Button text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all mb-2"
                  />
                  <input
                    type="url"
                    name="button2Url"
                    value={formData.button2Url}
                    onChange={handleChange}
                    placeholder="Button URL"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <Button type="submit">
                  {isEdit ? "Update Slider" : "Create Slider"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/sliders")}
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>

          {/* Image Upload & Preview */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Image Upload */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Background Image
              </h3>

              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all
                    ${isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"}
                  `}
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

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Recommended: 1920 x 1080 pixels (16:9)</p>
                  <p>• Use high-quality images for best display</p>
                  <p>• File formats: JPG, PNG, WEBP</p>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Live Preview
              </h3>

              <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <ImageIcon className="w-16 h-16" />
                  </div>
                )}
                {/* Overlay content */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                  <div className="p-8 max-w-md">
                    {formData.badge && (
                      <div className="mb-4">
                        <span className="inline-block px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-full">
                          {formData.badge}
                        </span>
                      </div>
                    )}
                    <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                      {formData.title || "Slider Title"}
                    </h2>
                    <p className="text-white/80 mb-6">
                      {formData.subtitle || "Slider subtitle will appear here"}
                    </p>
                    <div className="flex gap-3">
                      {formData.button1Text && (
                        <button className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg">
                          {formData.button1Text}
                        </button>
                      )}
                      {formData.button2Text && (
                        <button className="px-6 py-2.5 bg-white/10 text-white font-semibold rounded-lg border border-white/20">
                          {formData.button2Text}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
