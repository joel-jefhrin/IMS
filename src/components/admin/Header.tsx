"use client";

import { useEffect, useState } from "react";
import { MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setName(user?.name ?? "");
      } catch (error) {
        console.error("Invalid user data in localStorage");
      }
    }
  }, []);

  const firstLetter = name ? name.charAt(0).toUpperCase() : "A";

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm">
      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search..."
          className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500">
          <BellIcon className="w-5 h-5 text-gray-600" />
        </button>

        {/* Avatar */}
        <div
          title={name}
          className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold"
        >
          {firstLetter}
        </div>
      </div>
    </header>
  );
}
