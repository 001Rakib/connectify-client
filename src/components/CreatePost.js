"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import API from "@/utils/api";
import Image from "next/image";
import { ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function CreatePost({ onPostCreated }) {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); // Create a temporary URL for preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!description.trim() && !imageFile) {
      setError("Post must have either text or an image.");
      return;
    }

    // FormData to send both text and file data
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="my-6">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <Avatar>
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <form onSubmit={handleSubmit} className="w-full">
            <Textarea
              placeholder="What's on your mind?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border focus-visible:ring-0 text-base"
            />
            {preview && (
              <div className="mt-4 rounded-lg border overflow-hidden">
                <Image
                  src={preview}
                  alt="Preview"
                  className="object-cover w-full"
                  width={240}
                  height={240}
                />
              </div>
            )}
          </form>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <div>
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
          >
            <div className="flex items-center space-x-2 border border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors duration-300">
              <ImageIcon className="h-6 w-6 text-gray-400" />
              <span className="text-gray-600">
                {imageFile ? imageFile.name : "Click to upload an image"}
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
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || (!description && !imageFile)}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </CardFooter>
    </Card>
  );
}
