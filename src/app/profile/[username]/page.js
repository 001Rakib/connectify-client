"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import API from "../../../utils/api";
import Post from "../../../components/Post";

export default function ProfilePage() {
  // The useParams hook gives us access to the dynamic parts of the URL
  const params = useParams();
  const { username } = params;

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (username) {
      const fetchProfileData = async () => {
        try {
          setLoading(true);
          // Fetch user info and user's posts in parallel
          const [userRes, postsRes] = await Promise.all([
            API.get(`/users/${username}`),
            API.get(`/posts/profile/${username}`),
          ]);
          setProfileUser(userRes.data);
          setPosts(postsRes.data);
          setError("");
        } catch (err) {
          console.error("Failed to fetch profile data:", err);
          setError("User not found or failed to load data.");
        } finally {
          setLoading(false);
        }
      };
      fetchProfileData();
    }
  }, [username]); // Re-run this effect if the username in the URL changes

  if (loading)
    return <div className="text-center mt-10">Loading profile...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex items-center">
        <div className="w-24 h-24 rounded-full bg-gray-300 mr-6"></div>
        <div>
          <h1 className="text-3xl font-bold">{profileUser?.username}</h1>
          {/* Follower/following counts and a bio can go here later */}
          <p className="text-gray-600">Followers: 0 | Following: 0</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Posts</h2>
      <div>
        {posts.length > 0 ? (
          posts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <p>This user hasn&apos;t posted anything yet.</p>
        )}
      </div>
    </div>
  );
}
