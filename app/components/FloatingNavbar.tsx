"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function FloatingNavbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-6 left-1/2 z-50 -translate-x-1/2"
    >
      <div className="flex items-center gap-1 rounded-full border border-zinc-800 bg-black/70 px-2 py-2 backdrop-blur-xl shadow-lg">
        <NavItem href="/" label="Home" />
        <NavItem href="/checklist" label="Checklist" />
        <NavItem href="/contact" label="Contact" />

        <div className="mx-1 h-6 w-px bg-zinc-700" />

        <Link
          href="/signup"
          className="rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2 text-sm font-medium text-black transition hover:opacity-90"
        >
          Sign In
        </Link>
      </div>
    </motion.nav>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative rounded-full px-4 py-2 text-sm text-zinc-300 transition hover:text-white"
    >
      <span className="absolute inset-0 rounded-full bg-zinc-800 opacity-0 transition hover:opacity-100" />
      <span className="relative z-10">{label}</span>
    </Link>
  );
}
