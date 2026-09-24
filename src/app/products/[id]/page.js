"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { getProductById } from "../../../services/productApi";

export default function ProductDetailsPage() {
    const router = useRouter();
    const params = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.replace("/login");
            return;
        }

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProductById(params.id);

                setProduct(data);
            } catch (error) {
                if (error.response?.status === 404) {
                    setError("Product not found.");
                } else {
                    setError("Failed to load product.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />

                <main className="max-w-7xl mx-auto p-6">
                    <div className="bg-white rounded-xl p-10 text-center">
                        Loading product...
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />

                <main className="max-w-7xl mx-auto p-6">
                    <div className="bg-white rounded-xl p-10 text-center">

                        <h1 className="text-2xl font-bold text-red-600">
                            {error}
                        </h1>

                        <button
                            onClick={() => router.push("/products")}
                            className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg"
                        >
                            Back to Products
                        </button>

                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <main className="max-w-7xl mx-auto p-6">

                <button
                    onClick={() => router.push("/products")}
                    className="mb-6 text-blue-600 hover:underline"
                >
                    ← Back to Products
                </button>

                <div className="bg-white rounded-xl shadow p-6">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Images */}

                        <div>
                            <div className="mb-4">
                                <img
                                    src={product.images?.[0] || product.thumbnail}
                                    alt={product.title}
                                    className="w-full h-96 object-contain rounded-lg bg-gray-50"
                                />
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                                {product.images?.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${product.title} ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg border"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Product Information */}

                        <div>

                            <p className="text-sm text-gray-500 uppercase">
                                {product.category}
                            </p>

                            <h1 className="text-3xl font-bold mt-2">
                                {product.title}
                            </h1>

                            <div className="mt-4 flex items-center gap-4">
                                <span className="text-3xl font-bold">
                                    ${product.price}
                                </span>

                                <span className="text-yellow-500">
                                    ⭐ {product.rating}
                                </span>
                            </div>

                            <p className="mt-6 text-gray-600 leading-7">
                                {product.description}
                            </p>

                            <div className="mt-6 grid grid-cols-2 gap-4">

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-500">
                                        Stock
                                    </p>

                                    <p className="font-semibold mt-1">
                                        {product.stock}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-500">
                                        Brand
                                    </p>

                                    <p className="font-semibold mt-1">
                                        {product.brand || "N/A"}
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                    <button
                        onClick={() =>
                            router.push(`/products/${product.id}/edit`)
                        }
                        className="mt-6 bg-blue-600 text-white px-5 py-3 rounded-lg"
                    >
                        Edit Product
                    </button>

                    {/* Reviews */}

                    <div className="mt-10 border-t pt-8">

                        <h2 className="text-2xl font-bold mb-6">
                            Reviews
                        </h2>

                        {product.reviews?.length > 0 ? (
                            <div className="space-y-4">

                                {product.reviews.map((review, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg p-4"
                                    >
                                        <div className="flex items-center justify-between">

                                            <h3 className="font-semibold">
                                                {review.reviewerName}
                                            </h3>

                                            <span className="text-yellow-500">
                                                ⭐ {review.rating}
                                            </span>

                                        </div>

                                        <p className="text-gray-600 mt-2">
                                            {review.comment}
                                        </p>

                                        <p className="text-sm text-gray-400 mt-2">
                                            {review.date}
                                        </p>
                                    </div>
                                ))}

                            </div>
                        ) : (
                            <p className="text-gray-500">
                                No reviews available.
                            </p>
                        )}

                    </div>

                </div>

            </main>
        </div>
    );
}