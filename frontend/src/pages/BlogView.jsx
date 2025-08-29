import { User, Calendar, MoveLeft, Pencil, Trash2 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getBlogById, deleteBlog as deleteBlogApi } from '../services/api'

import DialogForm from "../components/DialogForm";

const BlogView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Prefer blog from navigation state for instant display
    if (location.state?.blog) {
      setBlog(location.state.blog);
      setLoading(false);
      // Optionally refresh from API in background using the id
      if (location.state.blog?.id && String(location.state.blog.id) !== String(id)) {
        // If route id differs from state, align it by fetching
        fetchBlogById(id);
      }
    } else if (id) {
      // Direct navigation: fetch from API
      fetchBlogById(id);
    } else {
      setLoading(false);
    }
  }, [location.state, id]);

  const fetchBlogById = async (blogId) => {
    try {
      const response = await getBlogById(blogId);
      setBlog(response);
    } catch (error) {
      console.error("Error fetching blog:", error);
      setBlog(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    setIsOpen(true)
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handleDelete = async () => {
    if (!blog?.id) return;
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlogApi(blog.id);
        navigate("/"); // Navigate back to list after deletion
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Failed to delete the post. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog post not found</h2>
          <p className="text-gray-600 mb-4">The blog post you're looking for doesn't exist.</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back Button (kept black as requested) */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 rounded-lg bg-black text-white py-2 px-4 hover:bg-gray-800 transition"
      >
        <MoveLeft size={18} />
        Back
      </button>

      {/* Blog Card */}
      <div className="max-w-4xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-6">
        {/* Title + Actions */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{blog.title}</h1>

          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
            >
              <Pencil size={16} /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex gap-6 text-sm text-gray-500 border-b pb-3 mb-4">
          <div className="flex items-center gap-1">
            <User size={16} /> {blog.author_name || blog.author_details?.full_name || "Anonymous"}
          </div>
          <div className="flex items-center gap-1">
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

        {/* Content */}
        <div className="max-h-[40rem] overflow-y-auto no-scroll pr-2">
          <div className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
            {blog.content}
          </div>
        </div>
      </div>

      <DialogForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        blog={blog}
        onBlogUpdated={(updated) => setBlog(updated)}
      />
    </div>
  );
};

export default BlogView;