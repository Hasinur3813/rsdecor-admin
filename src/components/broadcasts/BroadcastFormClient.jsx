"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Send, Plus } from "lucide-react";
import toast from "react-hot-toast";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import { BROADCASTS } from "@/lib/broadcasts";

export default function BroadcastFormClient() {
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params.id;

  // Initial form data
  const initialData = isEdit
    ? BROADCASTS.find((b) => b.id === params.id) || {
        title: "",
        message: "",
        recipients: 0,
        status: "Draft",
      }
    : { title: "", message: "", recipients: 0, status: "Draft" };

  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting broadcast:", formData);
    // Show success toast (using react-hot-toast)
    if (typeof toast !== "undefined") {
      toast.success(isEdit ? "Broadcast updated!" : "Broadcast created!");
    }
    router.push("/broadcasts");
  };

  const handleSend = () => {
    console.log("Sending broadcast:", formData);
    if (typeof toast !== "undefined") {
      toast.success("Broadcast sent!");
    }
    router.push("/broadcasts");
  };

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/broadcasts")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              {isEdit ? "Edit Broadcast" : "Create Broadcast"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEdit
                ? "Update your broadcast details"
                : "Create a new broadcast"}
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
                  Broadcast Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter broadcast title..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your broadcast message here..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Number of Recipients
                  </label>
                  <input
                    type="number"
                    name="recipients"
                    value={formData.recipients}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
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
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <Button type="submit">
                  {isEdit ? "Update Broadcast" : "Save as Draft"}
                </Button>
                {!isEdit && (
                  <Button onClick={handleSend} type="button">
                    <Send className="w-4 h-4 mr-2" />
                    Send Now
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => router.push("/broadcasts")}
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
                Tips for Creating Broadcasts
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Keep messages concise
                  and engaging
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Include a clear call
                  to action
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Personalize your
                  messages
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Test your message
                  before sending
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
