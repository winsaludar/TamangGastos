"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainNav({ title }) {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <nav className="flex px-4 xl:px-0">
      <Link href="/" className="text-2xl font-semibold">
        {title}
      </Link>

      <div className="flex flex-row items-center gap-5 ml-auto">
        <Link
          href="/"
          className={`font-medium ${
            !isActive("/") ? "text-gray-600 hover:text-white" : ""
          }`}
        >
          Home
        </Link>
        <Link
          href="/login"
          className={`font-medium ${
            !isActive("/login") ? "text-gray-600 hover:text-white" : ""
          }`}
        >
          Login
        </Link>
        <Link
          href="/about"
          className={`font-medium ${
            !isActive("/about") ? "text-gray-600 hover:text-white" : ""
          }`}
        >
          About
        </Link>
      </div>
    </nav>
  );
}
