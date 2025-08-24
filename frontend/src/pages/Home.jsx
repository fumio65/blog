import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CirclePlus } from "lucide-react";
import BlogCards from "../components/BlogCards";
import DialogForm from "../components/DialogForm";

const Home = () => {
  const blog = [
    {
      id: 1,
      title: "Do Hard Things if you want an Easy Life",
      description: "The one skill that changes everything",
      author: "Fumio",
      date: "Aug 20, 2024",
    },
    {
      id: 1,
      title: "Do Hard Things if you want an Easy Life",
      description: "The one skill that changes everything",
      author: "Fumio",
      date: "Aug 20, 2024",
    },
    {
      id: 1,
      title: "Do Hard Things if you want an Easy Life",
      description: "The one skill that changes everything",
      author: "Fumio",
      date: "Aug 20, 2024",
    },
    {
      id: 1,
      title: "Do Hard Things if you want an Easy Life",
      description: "The one skill that changes everything",
      author: "Fumio",
      date: "Aug 20, 2024",
    },
    {
      id: 1,
      title: "Do Hard Things if you want an Easy Life",
      description: "The one skill that changes everything",
      author: "Fumio",
      date: "Aug 20, 2024",
    },
    {
      id: 1,
      title: "Do Hard Things if you want an Easy Life",
      description: "The one skill that changes everything",
      author: "Fumio",
      date: "Aug 20, 2024",
    },
    {
      id: 1,
      title: "Do Hard Things if you want an Easy Life",
      description: "The one skill that changes everything",
      author: "Fumio",
      date: "Aug 20, 2024",
    },
    {
      id: 1,
      title: "Do Hard Things if you want an Easy Life",
      description: "The one skill that changes everything",
      author: "Fumio",
      date: "Aug 20, 2024",
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between max-w-3xl mx-auto mt-16">
        <Link className="text-3xl font-bold" to='/'>My Blog</Link>
        <button
         className="flex items-center gap-2 bg-black text-white p-2 rounded-lg btn-hover"
         onClick={() => setIsOpen(true)}
        >
          <CirclePlus size={18} />
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
