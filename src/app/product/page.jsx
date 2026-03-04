"use client";

import React, { useEffect, useState } from "react";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/service/productService";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchId, setSearchId] = useState("");

  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
  });

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getProducts();
      // Backend returns { status, data: { items: [...] } }
      const list = res?.data?.items || [];
      setProducts(Array.isArray(list) ? list : []);
    } catch (e) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
      };

      if (form.id) {
        await updateProduct(form.id, payload);
      } else {
        await createProduct(payload);
      }

      setForm({ id: "", name: "", description: "", price: "" });
      await loadProducts();
    } catch (e) {
      setError("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setLoading(true);
    setError("");
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (e) {
      setError("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId) {
      loadProducts();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await getProductById(searchId);
      const item = res?.data;
      if (item) {
        setProducts([item]);
      } else {
        setProducts([]);
        setError("Product not found");
      }
    } catch (e) {
      setError("Failed to search product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "960px", margin: "0 auto" }}>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
      >
        Products
      </h1>

      {error && (
        <div
          style={{
            marginBottom: "16px",
            padding: "8px 12px",
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSearch}
        style={{ display: "flex", gap: "8px", marginBottom: "24px" }}
      >
        <input
          type="text"
          placeholder="Search by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={{ flex: 1, padding: "8px 10px" }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
        <button
          type="button"
          onClick={loadProducts}
          style={{
            padding: "8px 16px",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </form>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          marginBottom: "32px",
          padding: "16px",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ padding: "8px 10px" }}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={{ padding: "8px 10px" }}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          style={{ padding: "8px 10px" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            alignSelf: "center",
          }}
        >
          {form.id ? "Update Product" : "Add Product"}
        </button>
      </form>

      {loading && <p>Loading...</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "12px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <h2 style={{ fontWeight: "600", marginBottom: "4px" }}>
              {p.name} (ID: {p.id})
            </h2>
            <p style={{ fontSize: "14px", color: "#4b5563" }}>
              {p.description}
            </p>
            <p style={{ fontWeight: "500", marginTop: "8px" }}>
              Price: {p.price}
            </p>
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <button
                type="button"
                onClick={() => handleEdit(p)}
                style={{
                  flex: 1,
                  padding: "6px 0",
                  backgroundColor: "#fbbf24",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                style={{
                  flex: 1,
                  padding: "6px 0",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {!loading && products.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  );
}

export default ProductPage;
