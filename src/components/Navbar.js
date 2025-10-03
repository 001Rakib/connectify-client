"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, User, Settings, LogOut } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, user, logout, loading, notifications } = useAuth();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);

  const displayNotification = (notification) => {
    console.log("from navbar", notification);
    const { sender, type } = notification;
    let actionText;
    if (type === "like") actionText = "liked your post.";
    else if (type === "comment") actionText = "commented on your post.";
    else actionText = "started following you.";

    return `${sender.name} ${actionText}`;
  };

  const handleReadNotifications = () => {
    setShowNotifications(!showNotifications);
    // We can add logic here later to mark notifications as read in the DB
  };

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
                <Image
                  src={"/conectify.svg"}
                  alt="connectify-logo"
                  height={35}
                  width={35}
                  className="pr-2"
                />
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
                {/* --- NOTIFICATION BELL --- */}
                <div className="relative">
                  <button
                    onClick={handleReadNotifications}
                    className="focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 justify-center items-center text-white text-xs">
                          {notifications.length}
                        </span>
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg p-4 z-10">
                      <h3 className="font-bold mb-2">Notifications</h3>
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div key={n._id} className="border-b py-1">
                            {displayNotification(n)}
                          </div>
                        ))
                      ) : (
                        <p>No new notifications.</p>
                      )}
                    </div>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar>
                        <AvatarImage
                          src={user?.profilePicture}
                          alt={user?.username}
                        />
                        <AvatarFallback>
                          {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.name}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={`/profile/${user.username}`}>
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={handleLogout}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
