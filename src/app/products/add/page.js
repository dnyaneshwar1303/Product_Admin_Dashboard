"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { createProduct } from "../../../services/productApi";

export default function AddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    brand: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const productData = {
        title: form.title,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        brand: form.brand,
      };

      await createProduct(productData);

      alert("Product created successfully!");

      router.push("/products");
    } catch (error) {
      setError("Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-4xl mx-auto p-6">

        <button
          onClick={() => router.push("/products")}
          className="mb-6 text-blue-600 hover:underline"
        >
          ← Back to Products
        </button>

        <div className="bg-white rounded-xl shadow p-6">

          <h1 className="text-3xl font-bold mb-6">
            Add Product
          </h1>

          {error && (
            <div className="mb-5 bg-red-100 text-red-700 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>
              <label className="block font-medium mb-2">
                Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3"
                placeholder="Enter product title"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full border rounded-lg px-4 py-3"
                placeholder="Enter product description"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3"
                placeholder="Enter category"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block font-medium mb-2">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full border rounded-lg px-4 py-3"
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full border rounded-lg px-4 py-3"
                  placeholder="Enter stock"
                />
              </div>

            </div>

            <div>
              <label className="block font-medium mb-2">
                Brand
              </label>

              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
                placeholder="Enter brand"
              />
            </div>

            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={() => router.push("/products")}
                className="px-5 py-3 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-5 py-3 rounded-lg disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Product"}
              </button>

            </div>

          </form>

        </div>

      </main>
    </div>
  );
}