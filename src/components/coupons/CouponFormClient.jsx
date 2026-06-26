"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Tag } from "lucide-react";
import toast from "react-hot-toast";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import { COUPONS, getCouponById } from "@/lib/coupons";

export default function CouponFormClient() {
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params.id;

  // Initial form data
  const initialData = isEdit
    ? getCouponById(params.id) || {
        code: "",
        type: "percentage",
        value: "",
        minOrder: "",
        maxDiscount: "",
        usageLimit: "",
        status: "Active",
        startDate: "",
        endDate: "",
        description: "",
      }
    : {
        code: "",
        type: "percentage",
        value: "",
        minOrder: "",
        maxDiscount: "",
        usageLimit: "",
        status: "Active",
        startDate: "",
        endDate: "",
        description: "",
      };

  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting coupon:", formData);
    // Show success toast
    if (typeof toast !== "undefined") {
      toast.success(isEdit ? "Coupon updated!" : "Coupon created!");
    }
    router.push("/coupons");
  };

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
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
              {isEdit ? "Edit Coupon" : "Create Coupon"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEdit
                ? "Update your coupon details"
                : "Create a new discount coupon"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Coupon Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g., WELCOME10"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Discount Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Discount Value
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  placeholder={formData.type === "percentage" ? "10" : "200"}
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Minimum Order
                  </label>
                  <input
                    type="number"
                    name="minOrder"
                    value={formData.minOrder}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Maximum Discount
                  </label>
                  <input
                    type="number"
                    name="maxDiscount"
                    value={formData.maxDiscount}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleChange}
                    placeholder="100"
                    min="1"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    required
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
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add a description for this coupon..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <Button type="submit">
                  {isEdit ? "Update Coupon" : "Create Coupon"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/coupons")}
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Tips for Creating Coupons
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Use memorable codes
                  like WELCOME10 or HOLIDAY
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Set reasonable usage
                  limits to control costs
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Add minimum order
                  values to ensure profitability
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Set clear validity
                  periods for urgency
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Use percentage
                  discounts for higher-value orders
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
