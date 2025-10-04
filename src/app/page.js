"use client";
import CreatePost from "@/components/CreatePost";
import Post from "@/components/Post";
import PrivateRoute from "@/components/PrivateRoute";
import Spinner from "@/components/Spinner";
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

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
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
          <Spinner />
        ) : (
          <div>
            {posts.map((post) => (
              <Post
                key={post._id}
                post={post}
                onPostDeleted={handlePostDeleted}
                onPostUpdated={handlePostUpdated}
              />
            ))}
          </div>
        )}
      </div>
    </PrivateRoute>
  );
}
