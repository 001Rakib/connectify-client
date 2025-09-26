export default function Post({ post }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-center mb-3">
        {/* We'll add a real profile picture later */}
        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
        <div>
          <p className="font-bold">{post.user.username}</p>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      <p className="text-gray-800">{post.description}</p>
      {/* Like and comment buttons will go here */}
    </div>
  );
}
