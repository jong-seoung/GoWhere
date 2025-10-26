// src/components/SearchBar.jsx
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("");
  const [tag, setTag] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSearch({ q, region, tag, page: 0 });
  };

  return (
    <form onSubmit={submit} className="flex-1">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          placeholder="키워드(제목/내용)"
          className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
        />
        <input
          value={region}
          onChange={(e)=>setRegion(e.target.value)}
          placeholder="지역(예: 제주)"
          className="w-full sm:w-48 bg-white border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
        />
        <input
          value={tag}
          onChange={(e)=>setTag(e.target.value)}
          placeholder="태그(예: 야경)"
          className="w-full sm:w-48 bg-white border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-gray-900 text-white font-medium hover:shadow"
        >
          검색
        </button>
      </div>
    </form>
  );
}
