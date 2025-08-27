import { useState, useEffect, useRef } from "react";
import { validateBlog } from "../utils/validation";
import { createBlog, updateBlog } from "../services/api";

const DialogForm = ({ blog = {}, isOpen, onClose, onBlogAdded, onBlogUpdated }) => {
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
      console.log('HAHA')
      onBlogAdded?.(newBlog);
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
    <div className="border border-blue-500 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white border border-black max-w-xl rounded-md mx-auto mt-32">
        <h1 className="text-xl font-bold p-6 border-b">{blog?.id ? "Edit blog" : "Create a new blog"}</h1>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="flex flex-col flex-1">
            <label
              htmlFor="blog-title"
              className={`font-bold mb-1
              ${fieldErrors.title ? "text-red-600" : ""}`}
            >
              Title
            </label>
            <input
              id="blog-title"
              type="text"
              className={`border border-black rounded-md p-1 h-10
                ${fieldErrors.title ? "border-red-600" : ""}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
            {fieldErrors.title && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.title}</p>
            )}
          </div>

          <div className="flex flex-col flex-1">
            <label
              htmlFor="blog-content"
              className={`font-bold mb-1
              ${fieldErrors.content ? "text-red-600" : ""}`}
            >
              Content
            </label>
            <textarea
              id="blog-content"
              rows="4"
              className={`border border-black rounded-md p-2
                ${fieldErrors.content ? "border-red-600" : ""}`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
            />
            {fieldErrors.content && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.content}</p>
            )}
          </div>

          {formError && <p className="text-red-600 text-sm">{formError}</p>}

          {success && <p className="text-green-600 text-sm">{success}</p>}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="border border-[#E2E8F0] shadow-md rounded-md py-2 px-4 hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-black text-white rounded-md py-2 px-4 btn-hover transition-colors duration-300
                ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DialogForm;
