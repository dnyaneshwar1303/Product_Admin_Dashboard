"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ProductsPage(){
    const router=useRouter();

    useEffect(()=>{
        const token = localStorage.getItem("token");

        if(!token){
            router.replace("/login");
        }
    }, [router]);

    const token= typeof window !== "undefined" ? localStorage.getItem("token"):null;

    if(!token){
        return null;
    }

    return(
        <div className="min-h-screen bg-gray-100">
            <Navbar/>
        <main className="max-w-7xl mx-auto p-6">
                <h1 className="text-3xl font-bold">
                    Products
                </h1>

                <p className="mt-2 text-gray-600">
                    Product dashboard coming soon...
                </p>
        </main>
        </div>
    )
}