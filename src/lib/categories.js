import axiosInstance from "./axiosInstance";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// Fetch all categories from API
export const fetchCategories = async (params = {}) => {
  const { data } = await axiosInstance.get("/categories", { params });
  return data;
};

// Fetch a single category by ID
export const fetchCategoryById = async (id) => {
  const { data } = await axiosInstance.get(`/categories/${id}`);
  return data;
};

// Fetch subcategories for a category
export const fetchSubcategories = async (categoryId) => {
  const { data } = await axiosInstance.get(
    `/categories/${categoryId}/subcategories`,
  );
  return data;
};

// Create new category
export const createCategory = async (formData) => {
  const { data } = await axiosInstance.post("/categories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Update category
export const updateCategory = async (id, formData) => {
  const { data } = await axiosInstance.put(`/categories/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Delete a category
export const deleteCategory = async (id) => {
  const { data } = await axiosInstance.delete(`/categories/${id}`);
  return data;
};

// Patch a category (single field update)
export const patchCategory = async (id, updates) => {
  const { data } = await axiosInstance.patch(`/categories/${id}`, updates);
  return data;
};

// --- SUBCATEGORY API HELPERS ---

// Create new subcategory
export const createSubcategory = async (categoryId, formData) => {
  const { data } = await axiosInstance.post(
    `/categories/${categoryId}/subcategories`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data;
};

// Update subcategory
export const updateSubcategory = async (
  categoryId,
  subcategoryId,
  formData,
) => {
  const { data } = await axiosInstance.put(
    `/categories/${categoryId}/subcategories/${subcategoryId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
};

// Delete subcategory
export const deleteSubcategory = async (categoryId, subcategoryId) => {
  const { data } = await axiosInstance.delete(
    `/categories/${categoryId}/subcategories/${subcategoryId}`,
  );
  return data;
};

export { formatDate };
