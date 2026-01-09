"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FloatingNavbar from "../components/FloatingNavbar";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch (err) {
      setError("Server not reachable");
      setLoading(false);
    }
  };

  return (
    <>
      <FloatingNavbar />

      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="w-[380px] rounded-2xl bg-zinc-900 p-8 shadow-lg border border-zinc-800">
          <h1 className="text-2xl font-semibold mb-6 text-white">
            Create Account
          </h1>

          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full mb-4 rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-500"
          />

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

          {error && (
            <p className="mb-4 text-sm text-red-400">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3 font-medium text-black transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <p className="mt-4 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <a href="/login" className="text-cyan-400 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
