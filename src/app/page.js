"use client";
import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <PrivateRoute>
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold">
          {/* Display a personalized welcome message */}
          Welcome to your feed, {user?.username}!
        </h1>
        <p className="mt-4 text-gray-700">
          This is your protected home page. Only logged-in users can see this.
        </p>
        {/* The post feed and post creation form will go here later */}
      </div>
    </PrivateRoute>
  );
}
