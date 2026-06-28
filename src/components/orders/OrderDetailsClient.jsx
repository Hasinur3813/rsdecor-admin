"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  MapPin,
  Calendar,
  User,
  ShoppingCart,
  DollarSign,
  Package,
  Download,
} from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Image from "next/image";
import { ORDER_DETAILS, downloadInvoice } from "@/lib/invoice";

const formatBDT = (n) => "৳" + Number(n).toLocaleString("en-IN");
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// Demo order data
const ORDERS = ORDER_DETAILS;

export default function OrderDetailsClient() {
  const router = useRouter();
  const params = useParams();
  const [status, setStatus] = useState("");

  // Find order by id
  const order = ORDERS.find((o) => o.id === params.id);

  if (!order) {
    return (
      <AdminShell>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800">
              Order Not Found
            </h2>
            <p className="text-gray-500 mt-2">
              The order you&apos;re looking for doesn&apos;t exist.
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
                    value={status || order.status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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
                  <p className="text-sm font-medium text-gray-800">
                    {formatDate(order.deliveryDate)}
                  </p>
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
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Order Items
              </h3>
              <div className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-xl object-cover border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-800 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatBDT(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">
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
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${order.phone}`} className="hover:text-primary">
                    {order.phone}
                  </a>
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
                  <Badge
                    status={
                      order.paymentStatus === "Paid" ? "Active" : "Inactive"
                    }
                  >
                    {order.paymentStatus}
                  </Badge>
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
