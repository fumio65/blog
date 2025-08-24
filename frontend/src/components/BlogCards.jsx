import { User, Calendar } from "lucide-react";

const BlogCards = ({ blog }) => {
  return (
    blog && (
      <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl cursor-pointer transition-shadow duration-300">
        <div className=" min-h-24">
          <h1 className="text-xl font-bold line-clamp-2">{blog.title}</h1>
          <p className="text-description line-clamp-1">{blog.description}</p>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 text-description">
            <User size={16} />
            {blog.author}
          </div>
          <div className="flex items-center gap-2 text-description">
            <Calendar size={16} />
            {blog.date}
          </div>
        </div>
      </div>
    )
  );
};

export default BlogCards;
