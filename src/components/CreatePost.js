"use client";
import API from "@/utils/api";
import { useState } from "react";

export default function CreatePost({ onPostCreated }) {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError("Post cannot be empty.");
      return;
    }
    try {
      const response = await API.post("/posts", { description });
      onPostCreated(response.data); // Call the parent function with the new post data
      setDescription(""); // Clear the textarea
      setError("");
    } catch (err) {
      setError("Failed to create post. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows="3"
          placeholder="What's on your mind?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
