"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Image as ImageIcon,
  GripVertical,
  MonitorPlay,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import AdminShell from "@/components/layout/AdminShell";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import TablePagination from "@/components/ui/TablePagination";
import TableSkeleton from "@/components/ui/TableSkeleton";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useTable } from "@/hooks/useTable";
import {
  fetchSliders,
  deleteSlider,
  resetDeleteState,
} from "@/store/slices/sliderSlice";

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getSliderStats = (sliders) => ({
  totalSliders: sliders.length,
  activeSliders: sliders.filter((s) => s.status === "Active").length,
});

// Column config for the skeleton (matches the 6 table columns)
const SKELETON_COLUMNS = [
  { width: "w-8", type: "text" },
  { width: "w-40", type: "double" },
  { width: "w-16", type: "image" },
  { width: "w-16", type: "badge" },
  { width: "w-20", type: "text" },
  { width: "w-20", type: "actions" },
];

export default function SlidersClient() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    sliders,
    fetchLoading,
    fetchError,
    deleteLoading,
    deleteSuccess,
    deleteError,
  } = useSelector((state) => state.slider);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  // ── Fetch on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchSliders());
  }, [dispatch]);

  // ── Delete feedback ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (deleteSuccess) {
      toast.success("Slider deleted successfully!");
      setDeletingId(null);
      dispatch(resetDeleteState());
    }
  }, [deleteSuccess, dispatch]);

  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError);
      setDeletingId(null);
      dispatch(resetDeleteState());
    }
  }, [deleteError, dispatch]);

  // ── Delete handler ──────────────────────────────────────────────────────────
  const handleDelete = (slider) => {
    if (!window.confirm(`Delete slider "${slider.heading}"?`)) return;
    setDeletingId(slider.id);
    dispatch(deleteSlider(slider.id));
  };

  // ── Filter & search ─────────────────────────────────────────────────────────
  const filteredSliders = (sliders || [])
    .filter((slider) => {
      const matchesSearch =
        (slider.heading || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (slider.subtext || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(slider.id).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "All" || slider.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => (a.sliderId || a.id) - (b.sliderId || b.id));

  // ── Table hook ──────────────────────────────────────────────────────────────
  const {
    paginatedData,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
    totalPages,
    setCurrentPage,
    setItemsPerPage,
    handleSort,
  } = useTable({
    data: filteredSliders,
    initialSortBy: "id",
    initialSortOrder: "asc",
    initialItemsPerPage: 5,
  });

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, setCurrentPage]);

  const stats = getSliderStats(filteredSliders);

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              Sliders
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage homepage slider content
            </p>
          </div>
          <Button onClick={() => router.push("/sliders/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Create Slider
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MonitorPlay className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-heading">
                  {fetchLoading ? "—" : stats.totalSliders}
                </div>
                <div className="text-xs font-medium text-gray-500">
                  Total Sliders
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <MonitorPlay className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-heading">
                  {fetchLoading ? "—" : stats.activeSliders}
                </div>
                <div className="text-xs font-medium text-gray-500">
                  Active Sliders
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fetch Error Banner */}
        {fetchError && (
          <div className="flex items-center justify-between gap-4 p-4 bg-red-50 border border-red-100 rounded-xl">
            <div className="flex items-center gap-3 text-sm text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{fetchError}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(fetchSliders())}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Retry
            </Button>
          </div>
        )}

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sliders by heading or subtext..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sliders Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  sortable
                  sortKey="id"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  <div className="flex items-center gap-1">
                    <GripVertical className="w-3.5 h-3.5" />
                    ID
                  </div>
                </TableHead>
                <TableHead
                  sortable
                  sortKey="heading"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Content
                </TableHead>
                <TableHead>Image</TableHead>
                <TableHead
                  sortable
                  sortKey="status"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Status
                </TableHead>
                <TableHead
                  sortable
                  sortKey="createdAt"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                >
                  Created
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fetchLoading ? (
                <TableSkeleton rows={5} columns={SKELETON_COLUMNS} />
              ) : paginatedData.length > 0 ? (
                paginatedData.map((slider) => (
                  <TableRow key={slider.id || slider._id}>
                    <TableCell>
                      <span className="text-sm font-semibold text-gray-700">
                        #{slider.id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-gray-800 truncate max-w-xs">
                          {slider.heading}
                        </span>
                        <span className="text-xs text-gray-500 truncate max-w-xs">
                          {slider.subtext}
                        </span>
                        {slider.badge && (
                          <span className="text-xs text-primary font-medium mt-0.5">
                            {slider.badge}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                          {slider.image ? (
                            <img
                              src={slider.image}
                              alt={slider.alt || slider.heading}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge status={slider.status || "Active"} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {slider.createdAt ? formatDate(slider.createdAt) : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/sliders/${slider.id}`)
                          }
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/sliders/${slider.id}/edit`)
                          }
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          disabled={deleteLoading && deletingId === slider.id}
                          onClick={() => handleDelete(slider)}
                        >
                          {deleteLoading && deletingId === slider.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="text-gray-400 text-sm">
                      {fetchError
                        ? "Failed to load sliders"
                        : "No sliders found"}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {!fetchLoading && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredSliders.length}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(val) => {
                setItemsPerPage(val);
                setCurrentPage(1);
              }}
            />
          )}
        </div>
      </div>
    </AdminShell>
  );
}
