    import axios from "axios";

    const API_BASE_URL = "http://127.0.0.1:8000/api/blog/";

    export const getBlogs = async () => {
      const res = await axios.get(API_BASE_URL);
      return res.data;
    };
