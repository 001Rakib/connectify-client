"use client";
import API from "@/utils/api";
import Image from "next/image";
import { useState } from "react";

export default function CreatePost({ onPostCreated }) {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); // Create a temporary URL for preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() && !imageFile) {
      setError("Post must have either text or an image.");
      return;
    }

    // Use FormData to send both text and file data
    const formData = new FormData();
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await API.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onPostCreated(response.data);
      // Reset form
      setDescription("");
      setImageFile(null);
      setPreview(null);
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

        {/* Image Preview */}
        {preview && (
          <div className="my-2">
            <Image
              src={preview}
              alt="Preview"
              height={240}
              width={240}
              className="max-h-60 rounded-lg"
            />
          </div>
        )}

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        <div className="flex justify-between items-center mt-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm px-3 py-2 rounded-md bg-purple-200"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
