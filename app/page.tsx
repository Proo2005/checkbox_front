"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FloatingNavbar from "./components/FloatingNavbar";

export default function HomePage() {
  const [userName, setUserName] = useState<string | null>(null);

  // Load logged-in user info from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("currentUserName");
    if (storedName) setUserName(storedName);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Floating Navbar */}
      <FloatingNavbar />

      {/* Top-right profile */}
      {userName && (
        <div className="fixed top-4 right-6 z-50 flex items-center gap-2 bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800">
          <div className="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-black">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-white font-medium">{userName}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold md:text-6xl"
        >
          Simple. Fast. Secure.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 max-w-xl text-zinc-400"
        >
          Manage your tasks, checklists, and workflows with a clean OxygenOS-inspired experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 flex gap-4"
        >
          <Link
            href="/signup"
            className="rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-3 font-medium text-black"
          >
            Get Started
          </Link>
          <Link
            href="/checklist"
            className="rounded-full border border-zinc-700 px-6 py-3 text-zinc-300 hover:text-white"
          >
            View Checklist
          </Link>
        </motion.div>

        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute right-1/3 top-1/4 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
        </div>
      </section>
    </div>
  );
}
