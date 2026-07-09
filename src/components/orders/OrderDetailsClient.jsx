/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  MapPin,
  Calendar,
  Package,
  Download,
  Loader2,
  Coins,
  Tag,
  Weight,
  ArrowUpDown,
  Ruler,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Image from "next/image";
import { downloadInvoice } from "@/lib/invoice";

const formatBDT = (n) => "৳" + Number(n).toLocaleString("en-IN");
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function OrderDetailsClient() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [isUpdatingDelivery, setIsUpdatingDelivery] = useState(false);

  const fetchOrder = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/orders/${params.id}`);
      if (response.data?.success) {
        setOrder(response.data.data);
        setStatus(response.data.data.status);
        setPaymentStatus(response.data.data.paymentStatus);
        // Format delivery date for input if it exists
        if (response.data.data.deliveryDate) {
          setDeliveryDate(
            new Date(response.data.data.deliveryDate)
              .toISOString()
              .split("T")[0],
          );
        }
      }
    } catch (error) {
      toast.error("Failed to load order");
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  const handleDeliveryDateChange = async (newDate) => {
    setDeliveryDate(newDate);
    setIsUpdatingDelivery(true);
    try {
      const response = await axiosInstance.patch(`/orders/${params.id}`, {
        field: "deliveryDate",
        value: newDate || null,
      });
      if (response.data?.success) {
        setOrder(response.data.data);
        toast.success("Delivery date updated");
      }
    } catch (error) {
      toast.error("Failed to update delivery date");
    } finally {
      setIsUpdatingDelivery(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === status) return;
    setIsUpdating(true);
    try {
      const response = await axiosInstance.patch(`/orders/${params.id}`, {
        field: "status",
        value: newStatus,
      });
      if (response.data?.success) {
        setOrder(response.data.data);
        setStatus(newStatus);
        toast.success("Order status updated");
      }
    } catch (error) {
      toast.error("Failed to update order");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentStatusChange = async (newPaymentStatus) => {
    if (newPaymentStatus === paymentStatus) return;
    setIsUpdatingPayment(true);
    try {
      const response = await axiosInstance.patch(`/orders/${params.id}`, {
        field: "paymentStatus",
        value: newPaymentStatus,
      });
      if (response.data?.success) {
        setOrder(response.data.data);
        setPaymentStatus(newPaymentStatus);
        toast.success("Payment status updated");
      }
    } catch (error) {
      toast.error("Failed to update payment status");
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  useEffect(() => {
    setTimeout(() => fetchOrder(), 0);
  }, [fetchOrder]);

  if (isLoading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AdminShell>
    );
  }

  if (!order) {
    return (
      <AdminShell>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800">
              Order Not Found
            </h2>
            <p className="text-gray-500 mt-2">
              The order you're looking for doesn't exist.
            </p>
            <Button className="mt-4" onClick={() => router.push("/orders")}>
              Back to Orders
            </Button>
          </div>
        </div>
      </AdminShell>
    );
  }

  const calculateSubtotal = (items) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subtotal = calculateSubtotal(order.items);

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/orders")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-heading text-2xl font-bold text-gray-900">
                Order {order.id}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Order details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => downloadInvoice(order)}>
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/orders/${order.id}`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Order
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
          {/* Order Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Status & Dates */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <Badge status={order.status} />
                  <div className="flex items-center gap-2">
                    <Badge
                      status={
                        order.paymentStatus === "Paid" ? "Active" : "Inactive"
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={isUpdating}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Order Date</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {formatDate(order.date)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Delivery Date</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => handleDeliveryDateChange(e.target.value)}
                      disabled={isUpdatingDelivery}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                    />
                    {deliveryDate && (
                      <button
                        onClick={() => handleDeliveryDateChange("")}
                        disabled={isUpdatingDelivery}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all disabled:opacity-50"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-sm text-amber-800">
                    <span className="font-semibold">Notes: </span>
                    {order.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Order Items
              </h3>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    {/* Item Image */}
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border border-gray-200 shrink-0"
                      />
                    ) : (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gray-200 flex items-center justify-center shrink-0 border border-gray-200">
                        <Package className="w-10 h-10 text-gray-500" />
                      </div>
                    )}

                    {/* Item Details */}
                    {/* Item Details */}
                    <div className="flex-1 min-w-0 space-y-3">
                      <h4
                        className="text-base font-semibold text-gray-900 truncate"
                        title={item.name}
                      >
                        {item.name}
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                        {item.sqft > 0 && (
                          <div className="bg-white px-3 py-2.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Ruler
                                className="w-3 h-3 text-gray-400"
                                strokeWidth={2}
                              />
                              <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                                Square Feet
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              {item.sqft}
                            </p>
                          </div>
                        )}

                        <div className="bg-white px-3 py-2.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                          <div className="flex items-center gap-1.5 mb-1">
                            <ArrowUpDown
                              className="w-3 h-3 text-gray-400"
                              strokeWidth={2}
                            />
                            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                              Height
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {item.height}
                          </p>
                        </div>

                        <div className="bg-white px-3 py-2.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Weight
                              className="w-3 h-3 text-gray-400"
                              strokeWidth={2}
                            />
                            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                              Weight
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {item.weight}
                          </p>
                        </div>

                        <div className="bg-white px-3 py-2.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Tag
                              className="w-3 h-3 text-gray-400"
                              strokeWidth={2}
                            />
                            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                              Price/Sqft
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatBDT(item.pricePerSqft)}
                          </p>
                        </div>

                        <div className="bg-white px-3 py-2.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Package
                              className="w-3 h-3 text-gray-400"
                              strokeWidth={2}
                            />
                            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                              Quantity
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {item.quantity}
                          </p>
                        </div>

                        <div className="bg-gray-900 px-3 py-2.5 rounded-lg border border-gray-900">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Coins
                              className="w-3 h-3 text-gray-400"
                              strokeWidth={2}
                            />
                            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                              Unit Price
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-white">
                            {formatBDT(item.price)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="flex items-center justify-end sm:justify-center sm:flex-col gap-2 border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0 sm:pl-4">
                      <p className="text-[10px] uppercase text-gray-400 font-medium">
                        Total
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {formatBDT(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="text-sm text-gray-800">
                    {formatBDT(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm text-gray-500">Delivery</span>
                  <span className="text-sm text-gray-800">Free</span>
                </div>
                <div className="flex items-center justify-between py-2 mt-1 border-t border-gray-100">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {formatBDT(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Payment */}
          <div className="flex flex-col gap-6">
            {/* Customer Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Customer Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    {order.customer.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {order.customer}
                    </p>
                    {order.customerId && (
                      <p className="text-xs text-gray-500">
                        ID: {order.customerId}
                      </p>
                    )}
                    {order.email && (
                      <p className="text-xs text-gray-500">{order.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${order.phone}`} className="hover:text-primary">
                    {order.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>Area: {order.area}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span>{order.address}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Payment Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Method</span>
                  <span className="text-sm font-medium text-gray-800">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      status={paymentStatus === "Paid" ? "Active" : "Inactive"}
                    >
                      {paymentStatus}
                    </Badge>
                    <select
                      value={paymentStatus}
                      onChange={(e) =>
                        handlePaymentStatusChange(e.target.value)
                      }
                      disabled={isUpdatingPayment}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Unpaid">Unpaid</option>
                      <option value="Partial">Partial</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Customer
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Mark as Delivered
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
