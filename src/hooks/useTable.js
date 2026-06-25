import { useState, useMemo } from "react";

export function useTable({ data, initialSortBy = null, initialSortOrder = "asc", initialItemsPerPage = 5 }) {
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortBy) return data;

    return [...data].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortBy, sortOrder]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, itemsPerPage]);

  // Total pages
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Handle sort
  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  return {
    sortedData,
    paginatedData,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
    totalPages,
    setCurrentPage,
    setItemsPerPage,
    handleSort
  };
}
