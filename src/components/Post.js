"use client";

import { useAuth } from "@/context/AuthContext";
import API from "@/utils/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Post({ post }) {
  const { user } = useAuth();
  // State to manage likes
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);

  // Check if the current user has already liked the post
  useEffect(() => {
    if (user) {
      setIsLiked(post.likes.includes(user._id));
    }
  }, [post.likes, user]);

  const handleLike = async () => {
    try {
      await API.put(`/posts/${post._id}/like`);

      // Update the state immediately for a responsive feel
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-center mb-3">
        {/* We'll add a real profile picture later */}
        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
        <div>
          <Link
            href={`/profile/${post.user.username}`}
            className="font-bold hover:underline"
          >
            {post.user.username}
          </Link>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      <p className="text-gray-800">{post.description}</p>
      {/* Like and comment buttons will go here */}
      <div className="flex items-center">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 focus:outline-none my-2 ${
            isLiked ? "text-indigo-600" : "text-gray-500"
          }`}
        >
          {/* Simple heart SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill={isLiked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 18.75l-7.682-7.868a4.5 4.5 0 010-6.364z"
            />
          </svg>
        </button>
        <span className="text-gray-600 text-sm">{likeCount} likes</span>
      </div>
    </div>
  );
}
