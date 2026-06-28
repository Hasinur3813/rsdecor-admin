/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Send,
  Megaphone,
  Users,
  Calendar,
} from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { BROADCASTS, formatDate } from "@/lib/broadcasts";

export default function BroadcastDetailsClient() {
  const router = useRouter();
  const params = useParams();

  // Find broadcast by id
  const broadcast = BROADCASTS.find((b) => b.id === params.id);

  if (!broadcast) {
    return (
      <AdminShell>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800">
              Broadcast Not Found
            </h2>
            <p className="text-gray-500 mt-2">
              The broadcast you're looking for doesn't exist.
            </p>
            <Button className="mt-4" onClick={() => router.push("/broadcasts")}>
              Back to Broadcasts
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
              onClick={() => router.push("/broadcasts")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-heading text-2xl font-bold text-gray-900">
                {broadcast.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Broadcast ID: {broadcast.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {broadcast.status === "Draft" && (
              <Button>
                <Send className="w-4 h-4 mr-2" />
                Send Now
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => router.push(`/broadcasts/${broadcast.id}/edit`)}
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
          {/* Broadcast Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Broadcast Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Megaphone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Title</div>
                    <div className="text-sm font-medium text-gray-800">
                      {broadcast.title}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Recipients</div>
                    <div className="text-sm font-medium text-gray-800">
                      {broadcast.recipients.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Date</div>
                    <div className="text-sm font-medium text-gray-800">
                      {formatDate(broadcast.date)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Preview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Message Preview
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
                {broadcast.message}
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
                {broadcast.status === "Draft" && (
                  <Button className="w-full justify-start">
                    <Send className="w-4 h-4 mr-2" />
                    Send Now
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    router.push(`/broadcasts/${broadcast.id}/edit`)
                  }
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Broadcast
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Status
                </h3>
                <div className="flex items-center gap-2">
                  <Badge status={broadcast.status} />
                  <span className="text-xs text-gray-500">
                    Created on {formatDate(broadcast.date)}
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
