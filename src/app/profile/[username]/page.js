"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import API from "../../../utils/api";
import Post from "../../../components/Post";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function ProfilePage() {
  const params = useParams();
  const { username } = params;
  const { user: loggedInUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    if (username) {
      const fetchProfileData = async () => {
        try {
          setLoading(true);
          const [userRes, postsRes] = await Promise.all([
            API.get(`/users/${username}`),
            API.get(`/posts/profile/${username}`),
          ]);

          const profileData = userRes.data;
          setProfileUser(profileData);
          setPosts(postsRes.data);

          // --- Check follow status and set state ---
          if (loggedInUser && profileData.followers) {
            setIsFollowing(profileData.followers.includes(loggedInUser._id));
            setFollowerCount(profileData.followers.length);
          }

          setError("");
        } catch (err) {
          setError("User not found or failed to load data.");
        } finally {
          setLoading(false);
        }
      };
      fetchProfileData();
    }
  }, [username, loggedInUser]);

  // --- FUNCTION TO HANDLE FOLLOW/UNFOLLOW ---
  const handleFollow = async () => {
    if (!profileUser) return;
    try {
      await API.put(`/users/${profileUser._id}/follow`);

      // Update state instantly for a better UX
      setIsFollowing(!isFollowing);
      setFollowerCount(isFollowing ? followerCount - 1 : followerCount + 1);
    } catch (err) {
      console.error("Failed to follow/unfollow user:", err);
    }
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  if (loading)
    return <div className="text-center mt-10">Loading profile...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-24 h-24 rounded-full bg-gray-300 mr-6 overflow-hidden">
            {/* Add this inside */}
            {profileUser?.profilePicture && (
              <Image
                src={profileUser.profilePicture}
                alt={profileUser.username}
                className="w-full h-full object-cover"
                width={96}
                height={96}
              />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{profileUser?.name}</h1>
            <h3 className="">@{profileUser?.username}</h3>
            <h3 className="text-gray-500">Bio: {profileUser?.bio}</h3>
            <p className="text-gray-600">
              Followers: {followerCount} | Following:{" "}
              {profileUser?.following?.length || 0}
            </p>
          </div>
        </div>
        {/* --- DYNAMIC FOLLOW BUTTON --- */}
        {loggedInUser && loggedInUser._id !== profileUser?._id && (
          <button
            onClick={handleFollow}
            className={`px-4 py-2 rounded-md font-semibold ${
              isFollowing
                ? "bg-gray-200 text-gray-800"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Posts</h2>
      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              onPostDeleted={handlePostDeleted}
              onPostUpdated={handlePostUpdated}
            />
          ))
        ) : (
          <p>This user hasn&apos;t posted anything yet.</p>
        )}
      </div>
    </div>
  );
}
