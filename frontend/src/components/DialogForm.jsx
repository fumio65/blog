const DialogForm = ({ isOpen, isClose }) => {
  return (
    <>
        {isOpen && (
      <div className="border border-blue-500 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
        <div className="bg-white border border-black max-w-xl rounded-md mx-auto mt-32">
          <h1 className="text-xl font-bold p-6 border-b">Create a new blog</h1>
          <form className=" space-y-4 p-6">
            <div className="flex flex-col flex-1">
              <label htmlFor="Title" className="font-bold mb-1">
                Title
              </label>
              <input
                type="text"
                className="border border-black rounded-md p-1 h-10"
              />
            </div>

            <div className="flex flex-col flex-1">
              <label htmlFor="Content" className="font-bold mb-1">
                Content
              </label>
              <textarea
                rows="4"
                className="border border-black rounded-md p-2"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                className="border border-[#E2E8F0] shadow-md rounded-md py-2 px-4 hover:bg-gray-100 transition-colors duration-300"
                onClick={isClose}
              >
                Cancel
              </button>
              <button className="bg-black text-white rounded-md py-2 px-4 btn-hover">
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default DialogForm;
