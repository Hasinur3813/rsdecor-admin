"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Tag,
  Percent,
  DollarSign,
  Calendar,
  Users,
  CheckCircle2,
} from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { COUPONS, formatDate, formatBDT, getCouponById } from "@/lib/coupons";

export default function CouponDetailsClient() {
  const router = useRouter();
  const params = useParams();

  // Find coupon by id
  const coupon = getCouponById(params.id);

  if (!coupon) {
    return (
      <AdminShell>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800">
              Coupon Not Found
            </h2>
            <p className="text-gray-500 mt-2">
              The coupon you're looking for doesn't exist.
            </p>
            <Button className="mt-4" onClick={() => router.push("/coupons")}>
              Back to Coupons
            </Button>
          </div>
        </div>
      </AdminShell>
    );
  }

  const getDiscountDisplay = () => {
    if (coupon.type === "percentage") {
      return `${coupon.value}% OFF`;
    }
    return formatBDT(coupon.value);
  };

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/coupons")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-heading text-2xl font-bold text-gray-900">
                {coupon.code}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Coupon ID: {coupon.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/coupons/${coupon.id}/edit`)}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coupon Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Coupon Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Tag className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Coupon Code</div>
                    <div className="text-sm font-bold text-gray-800 font-mono">
                      {coupon.code}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    {coupon.type === "percentage" ? (
                      <Percent className="w-5 h-5 text-green-600" />
                    ) : (
                      <DollarSign className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Discount</div>
                    <div className="text-sm font-bold text-primary">
                      {getDiscountDisplay()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Valid Period</div>
                    <div className="text-sm font-medium text-gray-800">
                      {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Usage</div>
                    <div className="text-sm font-medium text-gray-800">
                      {coupon.usedCount} / {coupon.usageLimit} times used
                    </div>
                  </div>
                </div>
              </div>

              {coupon.description && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">Description</div>
                  <div className="text-sm text-gray-700">
                    {coupon.description}
                  </div>
                </div>
              )}
            </div>

            {/* Conditions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Terms & Conditions
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div className="text-sm text-gray-700">
                    Minimum order value: <span className="font-semibold">{formatBDT(coupon.minOrder)}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div className="text-sm text-gray-700">
                    Maximum discount: <span className="font-semibold">{formatBDT(coupon.maxDiscount)}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div className="text-sm text-gray-700">
                    Usage limit: <span className="font-semibold">{coupon.usageLimit} times</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/coupons/${coupon.id}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Coupon
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Status
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <Badge status={coupon.status} />
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Created: {formatDate(coupon.startDate)}</div>
                  <div>Expires: {formatDate(coupon.endDate)}</div>
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Usage Statistics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Used</span>
                    <span>{coupon.usedCount} / {coupon.usageLimit}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(coupon.usedCount / coupon.usageLimit) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-center pt-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round((coupon.usedCount / coupon.usageLimit) * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">Usage Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
