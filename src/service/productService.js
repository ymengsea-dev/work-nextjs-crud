'use server'
import { apiRequest, getAuthToken } from "@/lib/api";

// get product
export const getProducts = async ({
  page = 0,
  size = 20,
  sortBy = "id",
  sortDir = "asc",
} = {}) => {
  try {
    const token = await getAuthToken ()

    if (!token) {
      throw new Error("No access token found in session");
    }

    const query = `?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
    const res = await apiRequest(`/products${query}`, "GET", null, token);
    return res?.data.items;
    
  } catch (error) {
    console.error("Get products error:", error);
    return null;
  }
};

// get product by id
export const getProductById = async (id) => {
  try {
    const token = await getAuthToken ()

    if (!token) {
      throw new Error("No access token found in session");
    }

    const res = await apiRequest(`/products/${id}`, "GET", null, token);
    return res;
  } catch (error) {
    console.error("Get product by id error:", error);
    return null;
  }
};

// post prod
export const createProduct = async (payload) => {
  try {
    const token = await getAuthToken ()

    if (!token) {
      throw new Error("No access token found in session");
    }

    const res = await apiRequest("/products", "POST", payload, token);
    return res;
  } catch (error) {
    console.error("Create product error:", error);
    return null;
  }
};

// update prod
export const updateProduct = async (id, payload) => {
  try {
    const token = await getAuthToken ()

    if (!token) {
      throw new Error("No access token found in session");
    }

    const res = await apiRequest(`/products/${id}`, "PUT", payload, token);
    return res;
  } catch (error) {
    console.error("Update product error:", error);
    return null;
  }
};

// delete prod
export const deleteProduct = async (id) => {
  try {
    const token = await getAuthToken ()

    if (!token) {
      throw new Error("No access token found in session");
    }

    const res = await apiRequest(`/products/${id}`, "DELETE", null, token);
    return res;
  } catch (error) {
    console.error("Delete product error:", error);
    return null;
  }
};
