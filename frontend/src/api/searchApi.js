import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8080/api",
});

export async function fetchPosts({ q, region, tag, sort = "createdAt", dir = "desc", page = 0, size = 12 } = {}) {
  const params = { q, region, tag, sort, dir, page, size };
  Object.keys(params).forEach((k) => (params[k] === undefined || params[k] === null || params[k] === "") && delete params[k]);
  const { data } = await client.get("/search/posts", { params });
  return data;
}
