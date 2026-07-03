"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Minus,
  Package,
  Calendar,
  DollarSign,
  Tag,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Image from "next/image";

const formatBDT = (n) => "৳" + Number(n).toLocaleString("en-IN");
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function ProductDetailsClient() {
  const router = useRouter();
  const params = useParams();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch product by id
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${params.id}`);
        if (response.data?.success) {
          setProduct(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axiosInstance.delete(`/products/${product._id}`);
      toast.success("Product deleted successfully");
      router.push("/products");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  if (isLoading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-gray-500 text-sm">Loading product details...</p>
          </div>
        </div>
      </AdminShell>
    );
  }

  if (!product) {
    return (
      <AdminShell>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800">
              Product Not Found
            </h2>
            <p className="text-gray-500 mt-2">
              The product you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button className="mt-4" onClick={() => router.push("/products")}>
              Back to Products
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
              onClick={() => router.push("/products")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-heading text-2xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Product Details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/products/${product._id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <Image
                src={product.images && product.images.length > 0 ? product.images[0] : ""}
                alt={product.imageAlt || product.name}
                width={400}
                height={400}
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Main Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <Badge status={product.status} />
                    <span className="text-sm text-gray-500">
                      {product.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mt-2">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-3">
                    {/* <DollarSign className="w-5 h-5 text-primary" /> */}
                    <span className="text-3xl font-bold text-primary">
                      {formatBDT(product.pricePerSqft || 0)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span
                      className={`text-sm font-semibold ${
                        product.status === "InStock"
                          ? "text-green-600"
                          : product.status === "LowStock"
                            ? "text-amber-600"
                            : "text-red-600"
                      }`}
                    >
                      {product.stock} in stock
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 justify-end">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      Added {product.createdAt ? formatDate(product.createdAt) : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-600">{product.description || "No description provided."}</p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Material
                  </h3>
                  <p className="text-sm text-gray-800 font-medium">
                    {product.material}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Room Type
                  </h3>
                  <p className="text-sm text-gray-800 font-medium">
                    {product.roomType || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Features
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.features && product.features.length > 0 ? product.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                    >
                      <Tag className="w-3.5 h-3.5 inline mr-1.5 text-gray-500" />
                      {feature}
                    </span>
                  )) : (
                    <span className="text-sm text-gray-400">No features listed</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Inventory
                </Button>
                <Button variant="outline">View Orders</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
