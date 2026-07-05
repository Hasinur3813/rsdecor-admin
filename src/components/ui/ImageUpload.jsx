"use client";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function ImageUpload({
  label,
  images = [],
  onChange,
  multiple = true,
  maxFiles = 10,
  maxSizeMB = 5,
  disabled = false,
  className,
  error,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const newImages = [];
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    for (let file of files) {
      if (!validTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}`);
        continue;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`File too large: ${file.name} (max ${maxSizeMB}MB)`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push(e.target.result);
        if (newImages.length === files.length) {
          const updatedImages = multiple
            ? [...images, ...newImages].slice(0, maxFiles)
            : [newImages[0]];
          onChange(updatedImages);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {label && (
        <label className="text-sm font-semibold text-gray-800">{label}</label>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Upload Area */}
        {(multiple || images.length === 0) && (
          <div
            onClick={() => !disabled && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={cn(
              "aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
              disabled && "opacity-60 cursor-not-allowed"
            )}
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <Upload className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-xs font-medium text-gray-600">
              {multiple ? "Add Image" : "Upload Image"}
            </p>
          </div>
        )}

        {/* Image Previews */}
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
            <img
              src={image}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center transition-all"
              >
                <X className="w-3.5 h-3.5 text-gray-600 hover:text-red-500" />
              </button>
            )}
          </div>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        disabled={disabled}
      />
      
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
