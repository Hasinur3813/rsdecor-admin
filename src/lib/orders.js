import axiosInstance from "./axiosInstance";
import { formatBDT, formatDate } from "./customers";

export const fetchOrders = async (params = {}) => {
  const { data } = await axiosInstance.get("/orders", { params });
  return data;
};

export const fetchOrderById = async (id) => {
  const { data } = await axiosInstance.get(`/orders/${id}`);
  return data;
};

export const fetchOrdersByCustomerId = async (customerId, params = {}) => {
  const { data } = await axiosInstance.get("/orders", {
    params: { customerId, ...params },
  });
  return data;
};

export { formatBDT, formatDate };
