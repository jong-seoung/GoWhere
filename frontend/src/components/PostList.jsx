// src/components/PostList.jsx
import { useEffect, useState } from "react";
import { fetchPosts } from "../api/searchApi";
import SearchBar from "./SearchBar";
import SortBar from "./SortBar";
import PostCard from "./PostCard";
import Pagination from "./Pagination";
import ErrorBanner from "./common/ErrorBanner";


const SkeletonCard = () => (
  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
    <div className="h-40 bg-gray-100 animate-pulse" />
    <div className="p-4 space-y-2">
      <div className="h-4 w-3/5 bg-gray-100 rounded animate-pulse" />
      <div className="h-4 w-4/5 bg-gray-100 rounded animate-pulse" />
      <div className="flex gap-2 mt-2">
        <div className="h-6 w-16 bg-gray-100 rounded animate-pulse" />
        <div className="h-6 w-12 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

export default function PostList() {
  const [params, setParams] = useState({ sort: "createdAt", dir: "desc", page: 0, size: 12 });
  const [data, setData] = useState({ content: [], totalPages: 0, number: 0 });
  const [loading, setLoading] = useState(false);
  const [rawError, setRawError] = useState("");

  const friendlyError = (e) => {
    const msg = e?.response?.data?.message || e?.message || "";
    // JDBC 같은 내부 에러는 사용자에겐 짧게
    if (msg.toLowerCase().includes("jdbc") || msg.toLowerCase().includes("sql")) {
      return "검색 중 문제가 발생했어요. 조건을 바꾸거나 잠시 후 다시 시도해 주세요.";
    }
    return msg || "문제를 확인 중입니다.";
  };

  const load = async (over = {}) => {
    setLoading(true);
    setRawError("");
    try {
      const merged = { ...params, ...over };
      const res = await fetchPosts(merged);
      setParams(merged);
      setData(res);
    } catch (e) {
      setRawError(friendlyError(e));
      setData({ content: [], totalPages: 0, number: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 헤더 + CTA */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">여행 게시글 검색/정렬</h1>
          <p className="text-sm text-gray-500 mt-1">키워드·지역·태그로 원하는 글을 찾아보세요.</p>
        </div>
        <a
          href="/buddies"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:shadow"
        >
          + 동행자 모집
        </a>
      </div>

      {/* 툴바 */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 mb-4">
        <SearchBar onSearch={(over)=>load({ ...over, page: 0 })} />
        <div className="flex items-center justify-between gap-3">
          <SortBar sort={params.sort} dir={params.dir} onChange={(over)=>load({ ...over, page: 0 })} />
        </div>
      </div>

      {/* 에러 */}
      {rawError && <ErrorBanner message={rawError} className="mb-4" />}

      {/* 로딩 */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* 빈 상태 */}
      {!loading && !rawError && data.content.length === 0 && (
        <div className="py-24 text-center">
          <div className="text-7xl mb-3">🗺️</div>
          <p className="text-lg font-semibold">조건에 맞는 게시글이 없어요</p>
          <p className="text-sm text-gray-500 mt-1">검색어를 바꾸거나 다른 정렬을 시도해 보세요.</p>
        </div>
      )}

      {/* 리스트 */}
      {!loading && !rawError && data.content.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.content.map((p) => <PostCard key={p.id} p={p} />)}
          </div>
          <Pagination
            className="mt-6"
            page={data.number}
            totalPages={data.totalPages}
            onPage={(next)=>load({ page: next })}
          />
        </>
      )}
    </div>
  );
}
