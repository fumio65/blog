import { User, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BlogCards = ({ blog }) => {
  const navigate = useNavigate();

  if (!blog) return null;

  const handleClick = () => {
    navigate(`/blog/${blog.id}`, { state: { blog } });
  };

  // Function to get author name with fallback logic - PRIORITIZE USERNAME
  const getAuthorName = () => {
    // Priority 1: Check for username in author object
    if (blog.author?.username) {
      return blog.author.username;
    }
    
    // Priority 2: Check for legacy author_name
    if (blog.author_name) {
      return blog.author_name;
    }
    
    // Priority 3: Check for username in author_details
    if (blog.author_details?.username) {
      return blog.author_details.username;
    }
    
    // Last resort: Anonymous
    return "Anonymous";
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl cursor-pointer transition-all duration-300 border border-gray-100 hover:border-gray-200"
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2">
          {blog.title}
        </h2>
        <p className="text-gray-600 line-clamp-3 leading-relaxed">
          {blog.content}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white rounded-full p-1">
              <User size={14} />
            </div>
            <span className="font-medium">{getAuthorName()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>
              {blog.created_at
                ? new Date(blog.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : ""}
            </span>
          </div>
        </div>
        
        {/* Read more indicator */}
        <div className="text-black font-medium text-sm">
          Read more →
        </div>
      </div>
    </div>
  );
};

export default BlogCards;