"use client";
import { useState } from "react";
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
} from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Image from "next/image";

// Demo product data
const PRODUCTS = [
  {
    id: "PRD-001",
    name: "Royal Floral 3D Wallpaper",
    category: "Wallpaper",
    price: 14000,
    stock: 45,
    status: "InStock",
    image: "/categories/wallpaper.jpg",
    addedDate: "2024-11-15",
    description:
      "Premium 3D floral wallpaper with intricate royal designs. Perfect for bedrooms and living rooms. Easy to install and maintain.",
    features: ["3D Effect", "Water Resistant", "Easy Installation", "Durable"],
    dimensions: "10m x 0.53m",
    material: "Vinyl",
  },
  {
    id: "PRD-002",
    name: "Ocean Blue Epoxy Floor",
    category: "Epoxy Floor",
    price: 40500,
    stock: 12,
    status: "LowStock",
    image: "/categories/floor.jpg",
    addedDate: "2024-10-20",
    description:
      "Stunning ocean blue epoxy flooring that gives a luxurious feel to any space. Highly durable and scratch resistant.",
    features: [
      "Scratch Resistant",
      "Glossy Finish",
      "Easy to Clean",
      "Long Lasting",
    ],
    dimensions: "Customizable",
    material: "Epoxy Resin",
  },
  {
    id: "PRD-003",
    name: "Cloud Dream Ceiling Paper",
    category: "Ceiling Paper",
    stock: 78,
    price: 14000,
    status: "InStock",
    image: "/categories/celingpaper.jpg",
    addedDate: "2024-10-05",
    description:
      "Beautiful cloud-patterned ceiling paper that creates a serene atmosphere. Ideal for kids' rooms and bedrooms.",
    features: ["Light Weight", "Easy to Paste", "Washable", "Non-Toxic"],
    dimensions: "10m x 0.53m",
    material: "Paper",
  },
  {
    id: "PRD-004",
    name: "Golden Damask Wallpaper",
    category: "Wallpaper",
    price: 14000,
    stock: 0,
    status: "OutOfStock",
    image: "/categories/wallpaper.jpg",
    addedDate: "2024-09-18",
    description:
      "Elegant golden damask wallpaper that adds a touch of sophistication to any interior design.",
    features: [
      "Premium Quality",
      "Fade Resistant",
      "Easy Maintenance",
      "Luxurious Look",
    ],
    dimensions: "10m x 0.53m",
    material: "Vinyl",
  },
  {
    id: "PRD-005",
    name: "Marble White Epoxy",
    category: "Epoxy Floor",
    price: 40500,
    stock: 23,
    status: "InStock",
    image: "/categories/floor.jpg",
    addedDate: "2024-09-01",
    description:
      "Classic marble white epoxy flooring that mimics the look of real marble at a fraction of the cost.",
    features: ["Marble Look", "High Gloss", "Stain Resistant", "Durable"],
    dimensions: "Customizable",
    material: "Epoxy Resin",
  },
  {
    id: "PRD-006",
    name: "Vintage Pink Wallpaper",
    category: "Wallpaper",
    price: 12500,
    stock: 34,
    status: "InStock",
    image: "/categories/bedroom.jpg",
    addedDate: "2024-08-22",
    description:
      "Charming vintage pink wallpaper with floral motifs. Perfect for creating a nostalgic and cozy atmosphere.",
    features: [
      "Vintage Design",
      "Soft Colors",
      "Easy to Install",
      "Breathable",
    ],
    dimensions: "10m x 0.53m",
    material: "Non-Woven",
  },
  {
    id: "PRD-007",
    name: "Wooden Texture Epoxy",
    category: "Epoxy Floor",
    price: 38000,
    stock: 5,
    status: "LowStock",
    image: "/categories/floor.jpg",
    addedDate: "2024-08-10",
    description:
      "Beautiful wooden texture epoxy flooring that looks and feels like real wood but is much more durable.",
    features: [
      "Wood Look",
      "Water Proof",
      "Termite Resistant",
      "Low Maintenance",
    ],
    dimensions: "Customizable",
    material: "Epoxy Resin",
  },
  {
    id: "PRD-008",
    name: "Modern Geometric Wallpaper",
    category: "Wallpaper",
    price: 15000,
    stock: 67,
    status: "InStock",
    image: "/categories/wallpaper.jpg",
    addedDate: "2024-07-28",
    description:
      "Contemporary geometric wallpaper with bold patterns. Ideal for modern homes and offices.",
    features: ["Modern Design", "Bold Patterns", "Easy Clean", "Peel & Stick"],
    dimensions: "10m x 0.53m",
    material: "Vinyl",
  },
];

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
  const [quantity, setQuantity] = useState(1);

  // Find product by id
  const product = PRODUCTS.find((p) => p.id === params.id);

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
              onClick={() => router.push(`/products/${product.id}`)}
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

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <Image
                src={product.image}
                alt={product.name}
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
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="text-3xl font-bold text-primary">
                      {formatBDT(product.price)}
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
                      Added {formatDate(product.addedDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-600">{product.description}</p>
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
                    Dimensions
                  </h3>
                  <p className="text-sm text-gray-800 font-medium">
                    {product.dimensions}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Features
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                    >
                      <Tag className="w-3.5 h-3.5 inline mr-1.5 text-gray-500" />
                      {feature}
                    </span>
                  ))}
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
