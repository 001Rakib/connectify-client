"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, loading, logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  if (loading) return null;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              {/* Website logo */}
              <Link href={"/"} className="flex items-center py-4 px-2">
                <span className="font-semibold text-lg text-gray-700">
                  Connectify
                </span>
              </Link>
            </div>
          </div>
          {/* Navbar Items */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  href={`/profile/${user.username}`}
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-indigo-500 hover:text-white transition duration-300"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-2 px-2 font-medium text-white bg-indigo-500 rounded hover:bg-indigo-400 transition duration-300"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-gray-200 transition duration-300"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="py-2 px-2 font-medium text-white bg-indigo-500 rounded hover:bg-indigo-400 transition duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
