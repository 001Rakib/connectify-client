"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "../../utils/api";
import PrivateRoute from "../../components/PrivateRoute";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { ImageIcon, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const { user, login } = useAuth(); // We need 'login' to update the global state
  const router = useRouter();

  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    setIsSubmittingPassword(true);
    try {
      const res = await API.put("/users/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess(res.data);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }); // Clear fields
    } catch (err) {
      setPasswordError(err.response?.data || "Failed to change password.");
    } finally {
      setIsSubmittingPassword(false);
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
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password here. After saving, you will be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-sm text-emerald-600">{passwordSuccess}</p>
              )}
              <CardFooter className="px-0 pt-4">
                <Button type="submit" disabled={isSubmittingPassword}>
                  {isSubmittingPassword && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmittingPassword ? "Saving..." : "Save Password"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  );
}
