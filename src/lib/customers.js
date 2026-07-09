import axiosInstance from "./axiosInstance";

// Format currency
const formatBDT = (n) => "৳" + Number(n).toLocaleString("en-IN");

// Format date
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// Fetch all customers from API
export const fetchCustomers = async (params = {}) => {
  const { data } = await axiosInstance.get("/customers", { params });
  return data;
};

// Fetch a single customer by ID
export const fetchCustomerById = async (id) => {
  const { data } = await axiosInstance.get(`/customers/${id}`);
  return data;
};

// Create new customer
export const createCustomer = async (customerData) => {
  const { data } = await axiosInstance.post("/customers", customerData);
  return data;
};

// Update customer
export const updateCustomer = async (id, customerData) => {
  const { data } = await axiosInstance.put(`/customers/${id}`, customerData);
  return data;
};

// Patch a customer (single field update)
export const patchCustomer = async (id, updates) => {
  const { data } = await axiosInstance.patch(`/customers/${id}`, updates);
  return data;
};

// Delete a customer
export const deleteCustomer = async (id) => {
  const { data } = await axiosInstance.delete(`/customers/${id}`);
  return data;
};

export { formatBDT, formatDate };
