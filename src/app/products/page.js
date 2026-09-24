"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { getCategories, getProducts } from "../../../services/productApi";

export default function ProductsPage() {
    const router = useRouter();

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);

    const [sortBy, setSortBy] = useState("");
    const [order, setOrder] = useState("asc");

    const fetchProducts = async (signal) => {
        try {
            setLoading(true);
            setError("");

            const skip = (page - 1) * pageSize;

            const data = await getProducts({
                limit: pageSize,
                skip,
                search,
                category,
                sortBy,
                order,
                signal,
            });

            setProducts(data.products);
            setTotal(data.total);
        } catch (error) {
            if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
                return;
            }

            setError("Failed to load products.");
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.replace("/login");
            return;
        }

        const controller = new AbortController();

        const timer = setTimeout(() => {
            fetchProducts(controller.signal);
        }, search ? 500 : 0);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };

    }, [page, pageSize, search, category, sortBy, order]);

    const totalPages = Math.ceil(total / pageSize);

    const startItem = total === 0
        ? 0
        : (page - 1) * pageSize + 1;

    const endItem = Math.min(
        page * pageSize,
        total
    );

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setPage(1);
    };

    const handlePrevious = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNext = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    const getPageNumbers = () => {
        const pages = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }

            return pages;
        }

        pages.push(1);

        if (page > 4) {
            pages.push("...");
        }

        const startPage = Math.max(2, page - 1);
        const endPage = Math.min(totalPages - 1, page + 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (page < totalPages - 3) {
            pages.push("...");
        }

        pages.push(totalPages);

        return pages;
    };

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getCategories();

                setCategories(data);
            } catch (error) {
                alert("Failed to load categories", error);
            }
        };

        loadCategories();
    }, [])

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

                    <div className="mb-6">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search products..."
                            className="w-full md:w-96 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6 flex flex-col md:flex-row gap-4">

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    setSearch("");
                                    setPage(1);
                                }}
                                className="border rounded-lg px-4 py-2 bg-white"
                            >
                                <option value="">
                                    All Categories
                                </option>

                                {categories.map((item) => (
                                    <option
                                        key={item.slug}
                                        value={item.slug}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Sort By
                            </label>

                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    setPage(1);
                                }}
                                className="border rounded-lg px-4 py-2 bg-white"
                            >
                                <option value="">
                                    Default
                                </option>

                                <option value="title">
                                    Title
                                </option>

                                <option value="price">
                                    Price
                                </option>

                                <option value="rating">
                                    Rating
                                </option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Order
                            </label>

                            <select
                                value={order}
                                onChange={(e) => {
                                    setOrder(e.target.value);
                                    setPage(1);
                                }}
                                className="border rounded-lg px-4 py-2 bg-white"
                            >
                                <option value="asc">
                                    Ascending
                                </option>

                                <option value="desc">
                                    Descending
                                </option>
                            </select>
                        </div>

                    </div>

                    <div className="flex items-center gap-2">
                        <label className="font-medium">
                            Page Size:
                        </label>

                        <select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="border rounded-lg px-3 py-2 bg-white"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
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
                    <>
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
                                    {products.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="border-b hover:bg-gray-50"
                                        >
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
                                                ⭐ {product.rating}
                                            </td>

                                            <td className="px-6 py-4">
                                                {product.stock}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>

                        {/* Pagination */}

                        <div className="mt-6 bg-white rounded-lg shadow p-4 flex flex-col md:flex-row items-center justify-between gap-4">

                            <p className="text-gray-600">
                                Showing {startItem}–{endItem} of {total}
                            </p>

                            <div className="flex items-center gap-2">

                                <button
                                    onClick={handlePrevious}
                                    disabled={page === 1}
                                    className="px-4 py-2 border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                                >
                                    Previous
                                </button>

                                {getPageNumbers().map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`px-4 py-2 rounded-lg border ${page === pageNumber
                                            ? "bg-blue-600 text-white"
                                            : "bg-white hover:bg-gray-100"
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}

                                <button
                                    onClick={handleNext}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                                >
                                    Next
                                </button>

                            </div>

                        </div>
                    </>
                )}

            </main>
        </div>
    );
}