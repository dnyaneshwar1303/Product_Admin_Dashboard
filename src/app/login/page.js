"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../../services/authApi";

export default function LoginPage(){
    const router=useRouter();

    const [username, setusername]=useState("");
    const [password, setPassword]=useState("");

    const [error, setError]=useState("");
    const [loading, setLoading]=useState(false);

    const handleSubmit = async (e)=>{
        e.preventDefault();

        if(loading) return;

        setError("");

        if(!username || !password){
            setError("Username and password are required");
            return;
        }

        try{
            setLoading(true);

            const data=await loginUser(username, password);

            localStorage.setItem("token",data.accessToken || data.token);

            localStorage.setItem("user",JSON.stringify(data));

            router.push("/products");
        }catch(err){
            setError(
                err.response?.data?.message || "Invalid username pr password"
            );
        }finally{
            setLoading(false);
        }
    };

    return(
        <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                <h1 className="text-3xl font-bold text-center mb-2">
                    Product Admin
                </h1>

                <p className="text-gray-500 text-center mb-8">
                    Login to continue
                </p>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-2 font-medium">
                            Username
                        </label>

                        <input 
                          type="text"
                          value={username}
                          onChange={(e)=>setusername(e.target.value)}
                          placeholder="Enter username"
                          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="bock mb-2 font-medium">
                            password
                        </label>

                        <input 
                          type="password"
                          value={password}
                          onChange={(e)=>setPassword(e.target.value)}
                          placeholder="Enter password"
                          className="w-full border rounded-lg px-4 py-3 outline focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Loggin in..." : "Login"}
                    </button>
                </form>

            </div>
        </main>
    )
}