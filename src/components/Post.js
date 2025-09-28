"use client";

import { useAuth } from "@/context/AuthContext";
import API from "@/utils/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Post({ post, onPostDeleted }) {
  const { user } = useAuth();
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

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

  // --- FUNCTIONS FOR COMMENTS ---
  const fetchComments = async () => {
    try {
      const response = await API.get(`/posts/${post._id}/comments`);
      setComments(response.data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const handleToggleComments = () => {
    const newShowState = !showComments;
    setShowComments(newShowState);
    // Fetch comments only when opening the section for the first time
    if (newShowState && comments.length === 0) {
      fetchComments();
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await API.post("/comments", {
        postId: post._id,
        text: newComment,
      });
      // Add the new comment to the top of the list for an instant update
      setComments([response.data, ...comments]);
      setNewComment(""); // Clear the input field
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  const handleDelete = async () => {
    // Show a confirmation dialog before deleting
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await API.delete(`/posts/${post._id}`);
        // Call the function passed from the parent to remove the post from the UI
        onPostDeleted(post._id);
      } catch (err) {
        console.error("Failed to delete post", err);
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-center mb-3 justify-between">
        <div className="flex items-center">
          {/* We'll add a real profile picture later */}
          <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
            {/* Add this inside */}
            {post.user.profilePicture && (
              <Image
                src={post.user.profilePicture}
                alt={post.user.username}
                className="w-full h-full object-cover"
                width={40}
                height={40}
              />
            )}
          </div>
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

        {user && user._id === post.user._id && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
      <p className="text-gray-800">{post.description}</p>

      {post.imageUrl && (
        <div className="my-3">
          <Image
            src={post.imageUrl}
            alt="Post image"
            className="rounded-lg h-96 w-full object-contain"
            height={500}
            width={400}
          />
        </div>
      )}

      {/* Like and comment buttons will go here */}
      <div className="flex items-center space-x-4 border-t pt-2 my-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 focus:outline-none ${
            isLiked ? "text-indigo-600" : "text-gray-500"
          }`}
        >
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
          <span>{likeCount} Likes</span>
        </button>
        <button
          onClick={handleToggleComments}
          className="flex items-center space-x-1 text-gray-500 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
          <span>
            {comments.length > 0 ? `${comments.length} Comments` : "Comment"}
          </span>
        </button>
      </div>

      {/* --- Comment Section (Conditional Rendering) --- */}
      {showComments && (
        <div className="mt-4">
          {/* Form to add a new comment */}
          <form onSubmit={handleCommentSubmit} className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white font-semibold px-4 rounded-md hover:bg-indigo-700"
            >
              Post
            </button>
          </form>

          {/* List of existing comments */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="flex items-start space-x-2 text-sm"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                  {/* Add this inside */}
                  {comment.user.profilePicture && (
                    <Image
                      src={comment.user.profilePicture}
                      alt={comment.user.username}
                      className="w-full h-full object-cover"
                      height={24}
                      width={24}
                    />
                  )}
                </div>
                <div className="bg-gray-100 rounded-lg p-2 flex-1">
                  <Link
                    href={`/profile/${comment.user.username}`}
                    className="font-bold hover:underline"
                  >
                    {comment.user.username}
                  </Link>
                  <p>{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
