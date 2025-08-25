import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { CirclePlus } from "lucide-react";

import { getBlogs } from "../services/api";

import BlogCards from "../components/BlogCards";
import DialogForm from "../components/DialogForm";

const Home = () => {
  const [blog, setBlog] = useState([]);
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true);  
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs();
        setBlog(data);
        console.log(data)
      } catch (err) {
        if (err.message === 'Network Error' || !err.response) {
          setError('Server is uncreachable. Please try again later.')
        } else {
          setError('An error occurred while fetching the blogs. Please try again later.')
        } 
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen border border-black">
        <p className="text-3xl text-description">Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between max-w-3xl mx-auto mt-16">
        <Link className="text-3xl font-bold" to='/'>My Blog</Link>
        <button
         className="flex items-center gap-2 bg-black text-white p-2 rounded-lg btn-hover"
         onClick={() => setIsOpen(true)}
        >
          <CirclePlus size={16} />
          New Post
        </button>
      </div>

      <div className="flex flex-col gap-4 mt-16 max-w-5xl mx-auto p-8 h-[44rem] overflow-hidden overflow-y-scroll no-scroll">
        {blog.map((blog) => (
          <BlogCards key={blog.id} blog={blog} />
        ))}
      </div>

        <DialogForm isOpen={isOpen} onClose={() => setIsOpen(false)}/>
    </div>
  );
};

export default Home;
