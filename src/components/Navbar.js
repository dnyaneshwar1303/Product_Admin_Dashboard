"use client";

import { useRouter } from "next/navigation";

export default function Navbar(){
    const router=useRouter();

    const handleLogout=()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.replace("/login");
    };

    return(
        <nav className="bg-white border-b px-6 py-4 flex items-center justify-between">

            <h1 className="text-xl font-bold">
                Product Admin Dashboard
            </h1>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
                Logout
            </button>
        </nav>
    );
}