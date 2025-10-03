"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "../../utils/api";
import PrivateRoute from "../../components/PrivateRoute";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { ImageIcon } from "lucide-react";

export default function SettingsPage() {
  const { user, login } = useAuth(); // We need 'login' to update the global state
  const router = useRouter();

  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Pre-fill the form with the user's current data
  useEffect(() => {
    if (user) {
      setBio(user.bio || "");
      setPreview(user.profilePicture || null);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bio", bio);
    if (imageFile) {
      formData.append("profilePicture", imageFile);
    }

    try {
      const response = await API.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // IMPORTANT: Update the user data in the global context and localStorage
      login({ ...response.data, token: localStorage.getItem("token") });

      // Redirect to the user's profile page
      router.push(`/profile/${user.username}`);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  return (
    <PrivateRoute>
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <div className="mt-2 flex items-center space-x-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                  {preview ? (
                    <Image
                      src={preview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                      width={96}
                      height={96}
                    />
                  ) : (
                    <div className="w-full h-full"></div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <div className="flex items-center space-x-2 border border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors duration-300">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                      <span className="text-gray-600">
                        {imageFile ? imageFile.name : "Update Profile Picture"}
                      </span>
                    </div>
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
                maxLength="150"
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </PrivateRoute>
  );
}
