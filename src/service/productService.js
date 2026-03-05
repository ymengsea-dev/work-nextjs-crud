'use server'
import { apiRequest, getAuthToken } from "@/lib/api";

// get product
export const getProducts = async ({
  page = 0,
  size = 20,
  sortBy = "id",
  sortDir = "asc",
  status,
  q,
} = {}) => {
  try {
    const token = await getAuthToken();

    if (!token) {
      throw new Error("No access token found in session");
    }

    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
      sortBy,
      sortDir,
    });

    if (status) {
      params.append("status", status);
    }

    if (q) {
      params.append("q", q);
    }

    const query = `?${params.toString()}`;
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
    return {
      status: {
        code: "ERROR",
        message: error.message || "Failed to create product.",
      },
      data: null,
    };
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
    return {
      status: {
        code: "ERROR",
        message: error.message || "Failed to update product.",
      },
      data: null,
    };
  }
};

// patch product status only
export const updateProductStatus = async (id, status) => {
  try {
    const token = await getAuthToken();

    if (!token) {
      throw new Error("No access token found in session");
    }

    const res = await apiRequest(
      `/products/${id}`,
      "PATCH",
      { status },
      token
    );
    return res;
  } catch (error) {
    console.error("Update product status error:", error);
    return {
      status: {
        code: "ERROR",
        message: error.message || "Failed to update product status.",
      },
      data: null,
    };
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
    return {
      status: {
        code: "ERROR",
        message: error.message || "Failed to delete product.",
      },
      data: null,
    };
  }
};
