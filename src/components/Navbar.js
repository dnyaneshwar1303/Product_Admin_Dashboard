"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <button
            onClick={() => router.push("/products")}
            className="text-xl font-bold text-left"
          >
            Product Admin
          </button>

          <div className="flex items-center gap-3">

            <button
              onClick={() => router.push("/products")}
              className="px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Products
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>

          </div>

        </div>

      </div>
    </nav>
  );
}