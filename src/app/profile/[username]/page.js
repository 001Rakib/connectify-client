"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import API from "../../../utils/api";
import Post from "../../../components/Post";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";

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
      <Card className="mb-6 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={profileUser?.profilePicture}
              alt={profileUser?.username}
            />
            <AvatarFallback className="text-4xl">
              {profileUser?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-foreground">
              {profileUser?.name}
            </h1>
            <h3 className="text-lg text-muted-foreground mb-2">
              @{profileUser?.username}
            </h3>
            {profileUser?.bio && (
              <p className="text-sm text-muted-foreground max-w-md mb-2">
                {profileUser.bio}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Followers: <span className="font-semibold">{followerCount}</span>{" "}
              | Following:{" "}
              <span className="font-semibold">
                {profileUser?.following?.length || 0}
              </span>
            </p>
          </div>
        </div>

        {/* --- DYNAMIC ACTIONS: FOLLOW/UNFOLLOW or EDIT PROFILE --- */}
        <div className="mt-4 md:mt-0">
          {loggedInUser && loggedInUser._id === profileUser?._id ? (
            // If viewing your own profile, show Edit Profile button
            <Button asChild>
              <Link href="/settings">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          ) : (
            // If viewing someone else's profile, show Follow/Unfollow button
            <Button
              onClick={handleFollow}
              variant={isFollowing ? "outline" : "default"} // Outline for unfollow, default for follow
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>
      </Card>

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
