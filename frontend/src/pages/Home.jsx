import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CirclePlus } from "lucide-react";

import { getBlogs } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

import BlogCards from "../components/BlogCards";
import DialogForm from "../components/DialogForm";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [blog, setBlog] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);  
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!isAuthenticated) {
        setBlog([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getBlogs();
        setBlog(data);
      } catch (err) {
        if (err.message === 'Network Error' || !err.response) {
          setError('Server is unreachable. Please try again later.');
        } else {
          setError('An error occurred while fetching the blogs. Please try again later.');
        } 
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, [isAuthenticated]);

  const addBlog = (newBlog) => {
    setBlog(prev => [newBlog, ...prev]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show empty white page
  if (!isAuthenticated) {
    return <div className="bg-white min-h-screen"></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Share your thoughts with the world</p>
          </div>
          <button
           className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg"
           onClick={() => setIsOpen(true)}
          >
            <CirclePlus size={20} />
            Create Post
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Blog Posts Section */}
        <div className="space-y-6">
          {blog.length === 0 && !error ? (
            <div className="text-center py-16">
              <div className="mb-4">
                <CirclePlus size={64} className="mx-auto text-gray-400 mb-4" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-6">Start sharing your thoughts by creating your first blog post!</p>
              <button
                onClick={() => setIsOpen(true)}
                className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Create Your First Post
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {blog.map((blogItem) => (
                <BlogCards key={blogItem.id} blog={blogItem} />
              ))}
            </div>
          )}
        </div>
      </div>

      <DialogForm
       isOpen={isOpen}
       onClose={() => setIsOpen(false)}
       onBlogAdded={addBlog} 
      />
    </div>
  );
};

export default Home;