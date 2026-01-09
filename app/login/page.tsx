"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import FloatingNavbar from "../components/FloatingNavbar";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }


      localStorage.setItem("currentUserId", data.userId); // store logged-in user ID


      toast.success("Login successful!");
      setTimeout(() => router.push("/"), 1000); // redirect after 1s
    } catch (err) {
      setLoading(false);
      toast.error("Server not reachable");
    }
  };

  return (
    <>
      <FloatingNavbar />
      <Toaster position="top-center" />
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="w-[380px] rounded-2xl bg-zinc-900 p-8 shadow-lg border border-zinc-800">
          <h1 className="text-2xl font-semibold mb-6 text-white">
            Login
          </h1>

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-4 rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-6 rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3 font-medium text-black transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-4 text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <a href="/signup" className="text-cyan-400 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
