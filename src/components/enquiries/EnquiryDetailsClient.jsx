"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  MessageSquare,
  User,
  Reply,
} from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { ENQUIRIES, formatDate } from "@/lib/enquiries";

export default function EnquiryDetailsClient() {
  const router = useRouter();
  const params = useParams();

  // Find enquiry by id
  const initialEnquiry = ENQUIRIES.find((e) => e.id === params.id);

  // State with local storage persistence
  const [enquiry, setEnquiry] = useState(null);

  useEffect(() => {
    if (initialEnquiry) {
      // Check if there's any stored status in localStorage
      const storedEnquiries = JSON.parse(
        localStorage.getItem("enquiries") || "{}",
      );
      if (storedEnquiries[params.id]) {
        setTimeout(() => {
          setEnquiry({ ...initialEnquiry, status: storedEnquiries[params.id] });
        }, 0);
      } else {
        setTimeout(() => {
          setEnquiry(initialEnquiry);
        }, 0);
      }
    }
  }, [initialEnquiry, params.id]);

  // Toggle status
  const toggleStatus = () => {
    if (!enquiry) return;
    const newStatus = enquiry.status === "New" ? "Replied" : "New";
    const updatedEnquiry = { ...enquiry, status: newStatus };
    setEnquiry(updatedEnquiry);

    // Save to localStorage
    const storedEnquiries = JSON.parse(
      localStorage.getItem("enquiries") || "{}",
    );
    storedEnquiries[params.id] = newStatus;
    localStorage.setItem("enquiries", JSON.stringify(storedEnquiries));
  };

  if (!enquiry) {
    return (
      <AdminShell>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800">
              Enquiry Not Found
            </h2>
            <p className="text-gray-500 mt-2">
              The enquiry you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button className="mt-4" onClick={() => router.push("/enquiries")}>
              Back to Enquiries
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
              onClick={() => router.push("/enquiries")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
                {enquiry.name.charAt(0)}
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold text-gray-900">
                  {enquiry.name}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Enquiry ID: {enquiry.id}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => window.open(`mailto:${enquiry.email}`, "_blank")}
            >
              <Mail className="w-4 h-4 mr-2" />
              Reply via Email
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
          {/* Enquiry Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Enquiry Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Name</div>
                    <div className="text-sm font-medium text-gray-800">
                      {enquiry.name}
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
                      href={`mailto:${enquiry.email}`}
                      className="text-sm font-medium text-gray-800 hover:text-primary"
                    >
                      {enquiry.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Phone</div>
                    <a
                      href={`tel:${enquiry.phone}`}
                      className="text-sm font-medium text-gray-800 hover:text-primary"
                    >
                      {enquiry.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Service</div>
                    <div className="text-sm font-medium text-gray-800">
                      {enquiry.service}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enquiry Message */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Customer Message
              </h3>
              <div className="text-sm text-gray-700 leading-relaxed">
                {enquiry.message}
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
                <Button onClick={toggleStatus} className="w-full justify-start">
                  <Reply className="w-4 h-4 mr-2" />
                  {enquiry.status === "New" ? "Mark as Replied" : "Mark as New"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open(`tel:${enquiry.phone}`, "_blank")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Customer
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    window.open(`mailto:${enquiry.email}`, "_blank")
                  }
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Status
                </h3>
                <div className="flex items-center gap-2">
                  <Badge status={enquiry.status} />
                  <span className="text-xs text-gray-500">
                    Received on {formatDate(enquiry.date)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
