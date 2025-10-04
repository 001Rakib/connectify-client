"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and user is not authenticated, redirect
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, loading, router]);

  // While loading, you can show a loader or nothing
  if (loading || !isAuthenticated) {
    return <Spinner />;
  }

  // If authenticated, render the children components
  return children;
};

export default PrivateRoute;
