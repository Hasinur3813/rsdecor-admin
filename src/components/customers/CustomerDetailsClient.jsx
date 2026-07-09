/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingCart,
  DollarSign,
  User,
  Eye,
  Download,
  Loader2,
  Shield,
  Power,
} from "lucide-react";
import toast from "react-hot-toast";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  fetchCustomerById,
  formatBDT,
  formatDate,
  patchCustomer,
  deleteCustomer,
} from "@/lib/customers";
import { fetchOrdersByCustomerId } from "@/lib/orders";
import { downloadInvoice } from "@/lib/invoice";

export default function CustomerDetailsClient() {
  const router = useRouter();
  const params = useParams();
  const [customer, setCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load customer
  const loadCustomer = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCustomerById(params.id);
      if (data.success) {
        setCustomer(data.data);
      }
    } catch (error) {
      console.error("Failed to load customer", error);
      toast.error("Failed to load customer");
    } finally {
      setIsLoading(false);
    }
  };

  // Load customer orders
  const loadCustomerOrders = async () => {
    if (!customer?.customerId) return;
    setIsLoadingOrders(true);
    try {
      const data = await fetchOrdersByCustomerId(customer.customerId, {
        sort: "date",
        order: "desc",
        limit: 10,
      });
      if (data.success) {
        setCustomerOrders(data.data);
      }
    } catch (error) {
      console.error("Failed to load customer orders", error);
      toast.error("Failed to load customer orders");
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Toggle customer status
  const handleToggleStatus = async () => {
    setIsUpdating(true);
    try {
      const data = await patchCustomer(customer._id, {
        field: "isActive",
        value: !customer.isActive,
      });
      if (data.success) {
        setCustomer({ ...customer, ...data.data });
        toast.success("Customer status updated");
      }
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  // Promote to admin
  const handlePromoteToAdmin = async () => {
    setIsUpdating(true);
    try {
      const data = await patchCustomer(customer._id, {
        field: "role",
        value: "admin",
      });
      if (data.success) {
        setCustomer({ ...customer, ...data.data });
        toast.success("Customer promoted to admin");
      }
    } catch (error) {
      console.error("Failed to promote", error);
      toast.error("Failed to promote");
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete customer
  const handleDeleteCustomer = async () => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    setIsUpdating(true);
    try {
      const data = await deleteCustomer(customer._id);
      if (data.success) {
        toast.success("Customer deleted");
        router.push("/customers");
      }
    } catch (error) {
      console.error("Failed to delete", error);
      toast.error("Failed to delete");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    setTimeout(() => loadCustomer(), 0);
  }, [params.id]);

  useEffect(() => {
    if (customer) {
      setTimeout(() => loadCustomerOrders(), 0);
    }
  }, [customer]);

  if (isLoading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AdminShell>
    );
  }

  if (!customer) {
    return (
      <AdminShell>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800">
              Customer Not Found
            </h2>
            <p className="text-gray-500 mt-2">
              The customer you're looking for doesn't exist.
            </p>
            <Button className="mt-4" onClick={() => router.push("/customers")}>
              Back to Customers
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
              onClick={() => router.push("/customers")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
                {customer.name.charAt(0)}
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold text-gray-900">
                  {customer.name}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Customer ID: {customer.customerId}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/customers/${customer._id}`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Customer
            </Button>
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleDeleteCustomer}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Customer Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Name</div>
                    <div className="text-sm font-medium text-gray-800">
                      {customer.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <a
                      href={`mailto:${customer.email}`}
                      className="text-sm font-medium text-gray-800 hover:text-primary"
                    >
                      {customer.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Phone</div>
                    <a
                      href={`tel:${customer.phone}`}
                      className="text-sm font-medium text-gray-800 hover:text-primary"
                    >
                      {customer.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Address</div>
                    <div className="text-sm font-medium text-gray-800">
                      {customer.address}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Stats */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Customer Statistics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl border border-gray-100">
                  <div className="text-2xl font-bold text-gray-900 font-heading">
                    {customer.totalOrders}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Total Orders</div>
                </div>

                <div className="text-center p-4 rounded-xl border border-gray-100">
                  <div className="text-2xl font-bold text-primary font-heading">
                    {formatBDT(customer.totalSpent)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Total Spent</div>
                </div>

                <div className="text-center p-4 rounded-xl border border-gray-100">
                  <div className="text-2xl font-bold text-gray-900 font-heading">
                    {formatDate(customer.createdAt)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Joined Date</div>
                </div>

                <div className="text-center p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-center">
                    <Badge status={customer.status} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Status</div>
                </div>
              </div>
            </div>
          </div>
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Recent Orders
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {customerOrders.length} total orders
                </p>
              </div>
              {customerOrders.length > 0 && (
                <Button
                  variant="ghost"
                  className="text-sm text-primary"
                  onClick={() => router.push("/orders")}
                >
                  View All
                </Button>
              )}
            </div>
            {customerOrders.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {customerOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-gray-700">
                            {order.id}
                          </span>
                          <Badge status={order.status} />
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {order.items[0].name}
                        {order.items.length > 1 &&
                          ` + ${order.items.length - 1} more`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <div className="text-right mr-2">
                        <div className="text-sm font-semibold text-gray-800">
                          {formatBDT(order.total)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(order.date)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadInvoice(order)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/orders/${order.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-sm">
                  No orders yet for this customer
                </div>
              </div>
            )}
          </div>
          {/* Quick Actions */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="flex flex-col gap-2">
                {customer.phone && (
                  <a
                    href={`tel:${customer.phone}`}
                    className="w-full"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Customer
                    </Button>
                  </a>
                )}

                {customer.email && (
                  <a
                    href={`mailto:${customer.email}`}
                    className="w-full"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                  </a>
                )}

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleToggleStatus}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Power className="w-4 h-4 mr-2" />
                  )}
                  {customer.status === "Active"
                    ? "Deactivate Customer"
                    : "Activate Customer"}
                </Button>

                {customer.role !== "admin" && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handlePromoteToAdmin}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Shield className="w-4 h-4 mr-2" />
                    )}
                    Promote to Admin
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/orders")}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View Orders
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
