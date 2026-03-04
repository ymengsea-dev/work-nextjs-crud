import { getSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";

// Fetch products with default paging/sorting that matches your Swagger URL
export const getProducts = async ({
  page = 0,
  size = 20,
  sortBy = "id",
  sortDir = "asc",
} = {}) => {
  try {
    const session = await getSession();
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No access token found in session");
    }

    const query = `?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
    const res = await apiRequest(`/products${query}`, "GET", null, token);
    // { status, data: { items: [...] } }
    return res;
  } catch (error) {
    console.error("Get products error:", error);
    return null;
  }
};

export const getProductById = async (id) => {
  try {
    const session = await getSession();
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No access token found in session");
    }

    const res = await apiRequest(`/products/${id}`, "GET", null, token);
    // { status, data: { ... } }
    return res;
  } catch (error) {
    console.error("Get product by id error:", error);
    return null;
  }
};

export const createProduct = async (payload) => {
  try {
    const session = await getSession();
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No access token found in session");
    }

    const res = await apiRequest("/products", "POST", payload, token);
    // { status, data: { ...new product... } }
    return res;
  } catch (error) {
    console.error("Create product error:", error);
    return null;
  }
};

export const updateProduct = async (id, payload) => {
  try {
    const session = await getSession();
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No access token found in session");
    }

    const res = await apiRequest(`/products/${id}`, "PUT", payload, token);
    // { status, data: { ...updated product... } }
    return res;
  } catch (error) {
    console.error("Update product error:", error);
    return null;
  }
};

export const deleteProduct = async (id) => {
  try {
    const session = await getSession();
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No access token found in session");
    }

    const res = await apiRequest(`/products/${id}`, "DELETE", null, token);
    // Backend returns empty body (null); just return whatever apiRequest gives
    return res;
  } catch (error) {
    console.error("Delete product error:", error);
    return null;
  }
};
