"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MonitorPlay,
  Image as ImageIcon,
  Tag,
  Link as LinkIcon,
  Calendar,
} from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { SLIDERS, formatDate, getSliderById } from "@/lib/sliders";

export default function SliderDetailsClient() {
  const router = useRouter();
  const params = useParams();

  // Find slider by id
  const slider = getSliderById(params.id);

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
                {slider.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Slider ID: {slider.id}
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
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800">Preview</h3>
              </div>
              <div className="relative aspect-video bg-gray-900">
                {slider.bgImage ? (
                  <img
                    src={slider.bgImage}
                    alt={slider.title}
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
                    {slider.badge && (
                      <div className="mb-4">
                        <span className="inline-block px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-full">
                          {slider.badge}
                        </span>
                      </div>
                    )}
                    <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                      {slider.title}
                    </h2>
                    <p className="text-white/80 mb-6">{slider.subtitle}</p>
                    <div className="flex gap-3">
                      {slider.button1Text && (
                        <button className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors">
                          {slider.button1Text}
                        </button>
                      )}
                      {slider.button2Text && (
                        <button className="px-6 py-2.5 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
                          {slider.button2Text}
                        </button>
                      )}
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
                      Position #{slider.order}
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
                      {formatDate(slider.createdAt)}
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
                {slider.button1Text && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Button 1</span>
                      <span className="text-xs font-semibold text-primary">
                        Primary
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      {slider.button1Text}
                    </div>
                    {slider.button1Url && (
                      <a
                        href={slider.button1Url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:text-primary-dark flex items-center gap-1 mt-1"
                      >
                        <LinkIcon className="w-3 h-3" />
                        {slider.button1Url}
                      </a>
                    )}
                  </div>
                )}

                {slider.button2Text && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Button 2</span>
                      <span className="text-xs font-semibold text-gray-500">
                        Secondary
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      {slider.button2Text}
                    </div>
                    {slider.button2Url && (
                      <a
                        href={slider.button2Url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:text-primary-dark flex items-center gap-1 mt-1"
                      >
                        <LinkIcon className="w-3 h-3" />
                        {slider.button2Url}
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
                <Badge status={slider.status} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
