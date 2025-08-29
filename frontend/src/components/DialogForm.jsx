import { useState, useEffect, useRef } from "react";
import { validateBlog } from "../utils/validation";
import { createBlog, updateBlog } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const DialogForm = ({ blog = {}, isOpen, onClose, onBlogAdded, onBlogUpdated }) => {
  const { user } = useAuth(); // Get current user
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    content: "",
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use ref to store timeout ID for cleanup
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (blog.title) setTitle(blog.title);
    if (blog.content) setContent(blog.content);
    console.log(title);
    console.log(content);
  }, [blog, isOpen]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setFieldErrors({ title: "", content: "" });
    setFormError("");
    setSuccess("");
    setIsSubmitting(false);
  };

  // Centralized cleanup function
  const clearPendingTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Reset form and cleanup when dialog is closed
  useEffect(() => {
    if (!isOpen) {
      resetForm();
      clearPendingTimeout(); // Single cleanup location
    }
  }, [isOpen]);

  // Cleanup timeout when component unmounts
  useEffect(() => {
    return () => {
      clearPendingTimeout();
    };
  }, []);

  const handleClose = () => {
    if (!isSubmitting) {
      onClose(); // This will trigger the useEffect cleanup
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setSuccess("");
    setFormError("");
    setFieldErrors({ title: "", content: "" });

    const errors = validateBlog({ title, content });
    if (errors) {
      setFieldErrors(errors);
      setIsSubmitting(false);
      return;
    }

    // Close dialog after a brief delay to show success message
    const SUCCESS_MESSAGE_DELAY = 1500;

    if (blog?.id) {
      try {
        const updated = await updateBlog(blog.id, { title, content });
        onBlogUpdated?.(updated);
        setSuccess("Blog updated successfully!");

        timeoutRef.current = setTimeout(() => {
          onClose();
        }, SUCCESS_MESSAGE_DELAY);
      } catch (error) {
        const response = error?.response?.data;
        let handled = false;

        if (
          response?.title &&
          Array.isArray(response.title) &&
          response.title.length > 0
        ) {
          setFieldErrors((prev) => ({
            ...prev,
            title: response.title[0],
          }));
          handled = true;
        }

        if (
          response?.content &&
          Array.isArray(response.content) &&
          response.content.length > 0
        ) {
          setFieldErrors((prev) => ({
            ...prev,
            content: response.content[0],
          }));
          handled = true;
        }

        if (
          error.code === "NETWORK_ERROR" ||
          error.message === "Network Error" ||
          !error.response ||
          error.response.status >= 500
        ) {
          setFormError("Server is unreachable. Please try again later.");
        } else if (!handled) {
          console.log("Errorrrrrrrr")
          setFormError("Failed to update blog. Please try again later.");
        }
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    try {
      const newBlog = await createBlog({ title, content });
      
      // Enhance the blog object with current user info - ONLY SET USERNAME
      const enhancedBlog = {
        ...newBlog,
        // Add the author object structure that matches your backend
        author: {
          id: user?.id,
          username: user?.username,
          first_name: user?.first_name,
          last_name: user?.last_name,
          // Remove full_name to ensure username is used
        },
        // Also set the legacy author_name for backward compatibility
        author_name: user?.username
      };
      
      console.log('HAHA')
      onBlogAdded?.(enhancedBlog);
      setSuccess("Blog created successfully!");

      timeoutRef.current = setTimeout(() => {
        onClose();
      }, SUCCESS_MESSAGE_DELAY);
    } catch (error) {
      const response = error?.response?.data;
      let handled = false;

      if (
        response?.title &&
        Array.isArray(response.title) &&
        response.title.length > 0
      ) {
        setFieldErrors((prev) => ({
          ...prev,
          title: response.title[0],
        }));
        handled = true;
      }

      if (
        response?.content &&
        Array.isArray(response.content) &&
        response.content.length > 0
      ) {
        setFieldErrors((prev) => ({
          ...prev,
          content: response.content[0],
        }));
        handled = true;
      }

      if (
        error.code === "NETWORK_ERROR" ||
        error.message === "Network Error" ||
        !error.response ||
        error.response.status >= 500
      ) {
        setFormError("Server is unreachable. Please try again later.");
      } else if (!handled) {
        setFormError("Failed to add blog. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-black to-gray-800 px-6 py-4">
          <h1 className="text-xl font-bold text-white">
            {blog?.id ? "Edit Post" : "Create New Post"}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label
              htmlFor="blog-title"
              className={`block text-sm font-medium mb-2 ${
                fieldErrors.title ? "text-red-600" : "text-gray-700"
              }`}
            >
              Title
            </label>
            <input
              id="blog-title"
              type="text"
              className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                fieldErrors.title 
                  ? "border-red-500 bg-red-50" 
                  : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="Enter your blog title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
            {fieldErrors.title && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {fieldErrors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="blog-content"
              className={`block text-sm font-medium mb-2 ${
                fieldErrors.content ? "text-red-600" : "text-gray-700"
              }`}
            >
              Content
            </label>
            <textarea
              id="blog-content"
              rows="6"
              className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none ${
                fieldErrors.content 
                  ? "border-red-500 bg-red-50" 
                  : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
            />
            {fieldErrors.content && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {fieldErrors.content}
              </p>
            )}
          </div>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              {formError}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              {success}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {blog?.id ? "Updating..." : "Creating..."}
                </div>
              ) : (
                blog?.id ? "Update Post" : "Create Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DialogForm;