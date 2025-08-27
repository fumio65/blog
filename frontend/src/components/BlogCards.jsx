import { User, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BlogCards = ({ blog }) => {
  const navigate = useNavigate();

  if (!blog) return null;

  const handleClick = () => {
    navigate(`/blog/${blog.id}`, { state: { blog } });
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl cursor-pointer transition-shadow duration-300"
    >
      <div className="min-h-24">
        <h2 className="text-xl font-bold line-clamp-2">{blog.title}</h2>
        <p className="text-gray-600 line-clamp-2 mt-1">{blog.content}</p>
      </div>

      <div className="flex gap-4 mt-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <User size={16} />
          {blog.author || "Anonymous"}
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          {blog.created_at
            ? new Date(blog.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : ""}
        </div>
      </div>
    </div>
  );
};

export default BlogCards;