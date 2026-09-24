"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import { getCategories, getProducts, deleteProduct } from "../../../services/productApi";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";

export default function ProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const pageFromURL = Number(searchParams.get("page"));

    const validPage =
        Number.isInteger(pageFromURL) && pageFromURL >= 1
            ? pageFromURL
            : 1;

    const [page, setPage] = useState(validPage);

    const pageSizeFromURL = Number(
        searchParams.get("pageSize")
    );

    const validPageSize = [10, 20, 50].includes(
        pageSizeFromURL
    )
        ? pageSizeFromURL
        : 10;

    const [pageSize, setPageSize] = useState(validPageSize);

    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState(searchParams.get("search") || "");

    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [categories, setCategories] = useState([]);

    const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "");
    const [order, setOrder] = useState(searchParams.get("order") || "asc");

    const updateURL = ({
        newPage = page,
        newPageSize = pageSize,
        newSearch = search,
        newCategory = category,
        newSortBy = sortBy,
        newOrder = order,
    }) => {
        const params = new URLSearchParams();

        params.set("page", newPage);
        params.set("pageSize", newPageSize);

        if (newSearch) {
            params.set("search", newSearch);
        }

        if (newCategory) {
            params.set("category", newCategory);
        }

        if (newSortBy) {
            params.set("sortBy", newSortBy);
        }

        if (newOrder) {
            params.set("order", newOrder);
        }

        router.replace(`/products?${params.toString()}`);
    };

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

            const calculatedTotalPages = Math.ceil(
                data.total / pageSize
            );

            if (page > calculatedTotalPages && calculatedTotalPages > 0) {
                setPage(calculatedTotalPages);

                updateURL({
                    newPage: calculatedTotalPages,
                });

                return;
            }

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
        const newPageSize = Number(e.target.value);
        setPageSize(newPageSize);
        setPage(1);

        updateURL({
            newPage: 1,
            newPageSize,
        })
    };

    const handlePrevious = () => {
        if (page > 1) {
            const newPage = page - 1;
            setPage(newPage);

            updateURL({
                newPage,
            });
        }
    };

    const handleNext = () => {
        if (page < totalPages) {
            const newPage = page + 1;
            setPage(newPage);
        }

        updateURL({
            newPage,
        })
    };

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);

        updateURL({
            newPage: pageNumber,
        })
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

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteProduct(id);

            alert("Product deleted successfully.");

            fetchProducts();
        } catch (error) {
            alert("Failed to delete product.");
        }
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
                        <button
                            onClick={() => router.push("/products/add")}
                            className="bg-blue-600 text-white px-5 py-3 rounded-lg"
                        >
                            + Add Product
                        </button>

                        <p className="text-gray-600 mt-1">
                            Manage your products
                        </p>
                    </div>

                    <div className="mb-6">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSearch(value);
                                setPage(1);
                                updateURL({
                                    newPage1,
                                    newSearch: value,
                                })
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
                                    const value = e.target.value;
                                    setCategory(value);
                                    setSearch("");
                                    setPage(1);

                                    updateURL({
                                        newPage1,
                                        newSearch: "",
                                        newCategory: value,
                                    })
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
                                    const value = e.target.value;

                                    setSortBy(value);
                                    setPage(1);

                                    updateURL({
                                        newPage: 1,
                                        newSortBy: value,
                                    })
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
                                    const value = e.target.value;
                                    setOrder(value);
                                    setPage(1);

                                    updateURL({
                                        newPage: 1,
                                        newOrder: value,
                                    })
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

                {loading && <LoadingSkeleton/>}

                {!loading && error && <ErrorState message={error} onRetry={fetchProducts}/>}

                {!loading && !error && products.length === 0 &&(
                    <EmptyState/>
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

                                        <th className="text-left px-6 py-4">
                                            Actions
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
                                                <button
                                                    onClick={() =>
                                                        router.push(`/products/${product.id}`)
                                                    }
                                                    className="text-blue-600 hover:underline text-left"
                                                >
                                                    {product.title}
                                                </button>
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

                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() =>
                                                        router.push(`/products/${product.id}/edit`)
                                                    }
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-600 hover:underline ml-4"
                                                >
                                                    Delete
                                                </button>
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