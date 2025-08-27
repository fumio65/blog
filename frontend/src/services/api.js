import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/blogs/"

export const getBlogById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}${id}/`);
  return res.data;
};

export const updateBlog = async (id, update) => {
  const res = await axios.patch(`${API_BASE_URL}${id}/`, update); // PATCH works now
  return res.data;
};

export const deleteBlog = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}${id}/`);
  return res.data;
};

export const getBlogs = async () => {
  const res = await axios.get(`${API_BASE_URL}`);
  return res.data;
};

export const createBlog = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}`, payload);
  return res.data;
};
