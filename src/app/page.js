"use client";
import CreatePost from "@/components/CreatePost";
import Post from "@/components/Post";
import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/context/AuthContext";
import API from "@/utils/api";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await API.get("/posts");
        setPosts(response.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    // Add the new post to the top of the list
    setPosts([newPost, ...posts]);
  };

  return (
    <PrivateRoute>
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold">
          {/* Display a personalized welcome message */}
          Welcome to your feed, {user?.name}!
        </h1>
        <CreatePost onPostCreated={handlePostCreated} />

        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <div>
            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </PrivateRoute>
  );
}
