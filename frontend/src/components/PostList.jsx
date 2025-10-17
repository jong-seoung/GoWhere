import { useEffect, useState } from "react";
import { fetchPosts } from "../api/searchApi";
import SearchBar from "./SearchBar";
import SortBar from "./SortBar";
import PostCard from "./PostCard";
import Pagination from "./Pagination";

export default function PostList() {
  const [params, setParams] = useState({ sort: "createdAt", dir: "desc", page: 0, size: 12 });
  const [data, setData] = useState({ content: [], totalPages: 0, number: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async (over = {}) => {
    setLoading(true);
    setError("");
    try {
      const merged = { ...params, ...over };
      const res = await fetchPosts(merged);
      setParams(merged);
      setData(res);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-4">
        <SearchBar onSearch={(over)=>load(over)} />
        <SortBar sort={params.sort} dir={params.dir} onChange={(over)=>load({ ...over, page: 0 })} />
      </div>

      {loading && <div className="p-4">불러오는 중...</div>}
      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.content.map((p) => <PostCard key={p.id} p={p} />)}
          </div>
          <Pagination page={data.number} totalPages={data.totalPages} onPage={(next)=>load({ page: next })}/>
        </>
      )}
    </div>
  );
}
