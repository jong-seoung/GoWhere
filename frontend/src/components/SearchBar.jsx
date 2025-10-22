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
    <form onSubmit={submit} className="flex flex-wrap gap-2 items-center">
      <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="키워드(제목/내용)" className="border rounded px-3 py-2"/>
      <input value={region} onChange={(e)=>setRegion(e.target.value)} placeholder="지역(예: 제주)" className="border rounded px-3 py-2"/>
      <input value={tag} onChange={(e)=>setTag(e.target.value)} placeholder="태그(예: 야경)" className="border rounded px-3 py-2"/>
      <button type="submit" className="bg-black text-white rounded px-4 py-2">검색</button>
    </form>
  );
}
