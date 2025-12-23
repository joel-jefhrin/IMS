"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  HomeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  LinkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useDBDataStore } from "@/store/dbData";

const adminNavItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
  { name: "Questions", href: "/admin/questions", icon: DocumentTextIcon },
  { name: "Campaigns", href: "/admin/campaigns", icon: BriefcaseIcon },
  { name: "Candidates", href: "/admin/candidates", icon: UserGroupIcon },
  { name: "Departments", href: "/admin/departments", icon: BuildingOfficeIcon },
  { name: "Results & Ranking", href: "/admin/results", icon: ChartBarIcon },
  { name: "Mappings", href: "/admin/mappings", icon: LinkIcon },
];
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    // For now, just redirect to login
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  return (
    <div
      className={`flex flex-col h-full bg-gray-800 text-white transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } shadow-lg`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        {isOpen && (
          <h1 className="text-2xl font-bold text-orange-400">IMS Admin</h1>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {isOpen ? (
            <ChevronLeftIcon className="w-5 h-5" />
          ) : (
            <ChevronRightIcon className="w-5 h-5" />
          )}
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {adminNavItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
              pathname?.startsWith(item.href) ? "bg-orange-600 text-white" : ""
            }`}
          >
            <item.icon className="w-5 h-5" />
            {isOpen && <span className="text-sm font-medium">{item.name}</span>}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-red-700 hover:text-white w-full text-left transition-colors duration-200"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
