"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Bell, CreditCard, Globe, Save } from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

// Tabs
const TABS = [
  { id: "general", label: "General Settings", icon: Globe },
  { id: "profile", label: "Profile Settings", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "payment", label: "Payment Settings", icon: CreditCard },
];

export default function SettingsClient() {
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    // General Settings
    storeName: "RS 3D Wallpaper & Floor",
    contactEmail: "contact@rswallpaper.com",
    contactPhone: "+880 1772 132 818",
    address: "House 123, Road 45, Dhanmondi, Dhaka",

    // Profile Settings
    adminName: "Admin User",
    adminEmail: "admin@rswallpaper.com",
    adminPhone: "+880 1772 132 818",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,

    // Payment Settings
    bkashNumber: "+880 1772 132 818",
    nagadNumber: "+880 1772 132 818",
  });

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving settings:", formData);
    toast.success("Settings saved successfully!");
  };

  const ActiveTabIcon = TABS.find((tab) => tab.id === activeTab)?.icon;

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          {ActiveTabIcon && (
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <ActiveTabIcon className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              Settings
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your admin panel settings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tabs Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <nav className="flex flex-col gap-1">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6"
            >
              <div className="border-b border-gray-100 pb-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {TABS.find((tab) => tab.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {activeTab === "general" &&
                    "Update your store information and basic settings"}
                  {activeTab === "profile" &&
                    "Manage your admin profile information"}
                  {activeTab === "notifications" &&
                    "Configure which notifications you want to receive"}
                  {activeTab === "payment" &&
                    "Set up your payment gateway credentials"}
                </p>
              </div>

              {/* General Settings */}
              {activeTab === "general" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Store Name
                    </label>
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Store Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Profile Settings */}
              {activeTab === "profile" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
                      {formData.adminName.charAt(0)}
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Upload Photo
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="adminName"
                        value={formData.adminName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="adminEmail"
                        value={formData.adminEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="adminPhone"
                      value={formData.adminPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        Email Notifications
                      </h3>
                      <p className="text-xs text-gray-500">
                        Receive updates about orders and enquiries
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={formData.emailNotifications}
                        onChange={handleChange}
                        className="opacity-0 w-0 h-0"
                      />
                      <span
                        className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${
                          formData.emailNotifications
                            ? "bg-primary"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute bg-white w-5 h-5 rounded-full top-0.5 left-0.5 transition-transform ${
                            formData.emailNotifications
                              ? "translate-x-6"
                              : "translate-x-0"
                          }`}
                        />
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        SMS Notifications
                      </h3>
                      <p className="text-xs text-gray-500">
                        Receive SMS alerts about orders
                      </p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        name="smsNotifications"
                        checked={formData.smsNotifications}
                        onChange={handleChange}
                        className="opacity-0 w-0 h-0"
                      />
                      <span
                        className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${
                          formData.smsNotifications
                            ? "bg-primary"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute bg-white w-5 h-5 rounded-full top-0.5 left-0.5 transition-transform ${
                            formData.smsNotifications
                              ? "translate-x-6"
                              : "translate-x-0"
                          }`}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === "payment" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        bKash Number
                      </label>
                      <input
                        type="tel"
                        name="bkashNumber"
                        value={formData.bkashNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Nagad Number
                      </label>
                      <input
                        type="tel"
                        name="nagadNumber"
                        value={formData.nagadNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-4 border-t border-gray-100">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
