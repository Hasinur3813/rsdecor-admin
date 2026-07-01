"use client";
import { useState, useEffect, useCallback } from "react";
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
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  fetchSliders,
  deleteSlider,
  resetDeleteState,
  updateSlider,
  resetUpdateState,
} from "@/store/slices/sliderSlice";

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
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
    totalSliders,
    activeSliders,
    pagination,
    fetchLoading,
    fetchError,
    deleteLoading,
    deleteSuccess,
    deleteError,
    updateLoading,
    updateSuccess,
    updateError,
  } = useSelector((state) => state.slider);

  // ── Local pagination / filter state ─────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("sliderId");
  const [sortOrder, setSortOrder] = useState("asc");
  const [deletingId, setDeletingId] = useState(null);
  const [sliderToDelete, setSliderToDelete] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // ── Fetch sliders from server ───────────────────────────────────────────────
  const loadSliders = useCallback(
    (params = {}) => {
      dispatch(
        fetchSliders({
          page: params.page ?? currentPage,
          limit: params.limit ?? itemsPerPage,
          search: params.search ?? searchTerm,
          sort: params.sort ?? sortBy,
          order: params.order ?? sortOrder,
          status: params.status ?? filterStatus,
        }),
      );
    },
    [dispatch, currentPage, itemsPerPage, searchTerm, sortBy, sortOrder, filterStatus],
  );

  // ── Initial load + re-fetch when page, limit, sort, or status changes ──────
  useEffect(() => {
    loadSliders();
  }, [currentPage, itemsPerPage, sortBy, sortOrder, filterStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Debounced search ────────────────────────────────────────────────────────
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      setCurrentPage(1);
      loadSliders({ page: 1, search: searchTerm });
    }, 400);
    setSearchTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Delete feedback ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (deleteSuccess) {
      toast.success("Slider deleted successfully!");
      setDeletingId(null);
      setSliderToDelete(null);
      dispatch(resetDeleteState());
      loadSliders();
    }
  }, [deleteSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError);
      setDeletingId(null);
      setSliderToDelete(null);
      dispatch(resetDeleteState());
    }
  }, [deleteError, dispatch]);

  // ── Update feedback ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (updateSuccess && togglingId) {
      toast.success("Slider status updated!");
      setTogglingId(null);
      dispatch(resetUpdateState());
      loadSliders(); // refresh list to ensure counts stay accurate
    }
  }, [updateSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (updateError && togglingId) {
      toast.error(updateError);
      setTogglingId(null);
      dispatch(resetUpdateState());
    }
  }, [updateError, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleDelete = (slider) => {
    setSliderToDelete(slider);
  };

  const handleToggleStatus = (slider) => {
    const newStatus = slider.status === "Active" ? "Inactive" : "Active";
    setTogglingId(slider.id || slider._id);
    const fd = new FormData();
    fd.append("status", newStatus);
    dispatch(updateSlider({ id: slider.id || slider._id, formData: fd }));
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (val) => {
    setItemsPerPage(val);
    setCurrentPage(1);
  };

  // ── Derived values ──────────────────────────────────────────────────────────
  const { totalPages, totalItems } = pagination;

  return (
    <AdminShell>
      <ConfirmModal
        isOpen={!!sliderToDelete}
        onClose={() => setSliderToDelete(null)}
        onConfirm={() => {
          const id = sliderToDelete?.id || sliderToDelete?._id;
          if (id) {
            setDeletingId(id);
            dispatch(deleteSlider(id));
          }
        }}
        title="Delete Slider"
        message={sliderToDelete ? `Are you sure you want to delete the slider "${sliderToDelete.heading}"? This action cannot be undone.` : ""}
        confirmText="Delete Slider"
        type="danger"
        isLoading={deleteLoading}
      />
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
                  {fetchLoading ? "—" : totalSliders}
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
                  {fetchLoading ? "—" : activeSliders}
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
              onClick={() => loadSliders()}
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
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
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
                  sortKey="sliderId"
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
                <TableSkeleton rows={itemsPerPage} columns={SKELETON_COLUMNS} />
              ) : sliders.length > 0 ? (
                sliders.map((slider) => (
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
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={updateLoading && togglingId === (slider.id || slider._id)}
                          onClick={() => handleToggleStatus(slider)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                            slider.status === "Active" ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                              slider.status === "Active" ? "translate-x-5" : "translate-x-0"
                            }`}
                          >
                            {updateLoading && togglingId === (slider.id || slider._id) && (
                              <RefreshCw className="w-3 h-3 text-gray-400 animate-spin" />
                            )}
                          </span>
                        </button>
                        <span
                          className={`text-sm font-medium ${
                            slider.status === "Active" ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {slider.status || "Active"}
                        </span>
                      </div>
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
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </div>
      </div>
    </AdminShell>
  );
}
