"use client";

import Link from "next/link";
import { destroyCookie } from "nookies";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function MainNav({ title }) {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;
  const router = useRouter();

  const handleLogout = function (e) {
    e.preventDefault();
    destroyCookie(null, "token");
    router.push("/login");
  };

  return (
    <nav className="flex px-4 xl:px-0">
      <Link href="/" className="text-2xl font-semibold">
        {title}
      </Link>

      <div className="flex flex-row items-center gap-5 ml-auto">
        <Link
          href="/"
          className={`font-medium ${
            !isActive("/") ? "text-gray-600 hover:text-gray-900" : ""
          }`}
        >
          Home
        </Link>
        <button
          className={`font-medium ${
            !isActive("/logout") ? "text-gray-600 hover:text-gray-900" : ""
          }`}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
