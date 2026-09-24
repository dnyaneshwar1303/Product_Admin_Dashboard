"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getProducts } from "../../../services/productApi";

export default function ProductsPage() {
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.replace("/login");
            return;
        }

        fetchProducts();

    }, [router]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getProducts();
            setProducts(data.products);
        } catch (err) {
            setError("failed to load products...");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <main className="max-w-7xl mx-auto p-6">

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Products
                        </h1>

                        <p className="text-gray-600 mt-1">
                            Manage your products
                        </p>
                    </div>
                </div>

                {loading && (
                    <div className="bg-white rounded-lg p-8 text-center">
                        Loading products...
                    </div>
                )}

                {error && (
                    <div className="bg-white rounded-lg p-8 text-center">
                        <p className="text-red-600 mb-4">
                            {error}
                        </p>

                        <button
                            onClick={fetchProducts}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                            Retry
                        </button>

                    </div>
                )}

                {!loading && !error && products.length === 0 && (
                    <div className="bg-white rounded-lg p-8 text-center">
                        No products found.
                    </div>
                )}

                {!loading && !error && products.length > 0 && (
                    <div className="bg-white rounded-lg shadow overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-6 py-4">
                                        Image
                                    </th>

                                    <th className="text-left px-6 py-4">
                                        Title
                                    </th>

                                    <th className="text-left px-6 py-4">
                                        Category
                                    </th>

                                    <th className="text-left px-6 py-4">
                                        Price
                                    </th>

                                    <th className="text-left px-6 py-4">
                                        Rating
                                    </th>

                                    <th className="text-left px-6 py-4">
                                        Stock
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                { products.map((product)=>(
                                    <tr key={product.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <img
                                               src={product.thumbnail}
                                               alt={product.title}
                                               className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        </td>

                                        <td className="px-6 py-4 font-medium">
                                            {product.title}
                                        </td>

                                        <td className="px-6 py-4">
                                            {product.category}
                                        </td>

                                        <td className="px-6 py-4">
                                            ${product.price}
                                        </td>

                                        <td className="px-6 py-4">
                                            {product.stock}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                    </div>
                )}

            </main>
        </div>
    )
}