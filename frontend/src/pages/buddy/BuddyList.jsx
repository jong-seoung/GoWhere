// src/pages/buddy/BuddyList.jsx
import { useEffect, useState } from "react";
import { BuddyPostAPI } from "../../api/buddy";
import { Link } from "react-router-dom";

function Badge({ children, type = "default" }) {
  const styles = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-green-100 text-green-700",
    danger: "bg-rose-100 text-rose-700",
    info: "bg-indigo-100 text-indigo-700",
  }[type];
  return <span className={`px-2 py-0.5 text-xs rounded-full ${styles}`}>{children}</span>;
}

export default function BuddyList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [locationCode, setLocationCode] = useState("");
  const [tag, setTag] = useState("");
  const [hostId, setHostId] = useState("");

  const load = async (p = 0) => {
    setLoading(true);
    try {
      const { data } = await BuddyPostAPI.search({
        q,
        locationCode,
        tag,
        hostId,
        page: p,
        size: 8,
      });
      setItems(data.content || []);
      setTotalPages(data.totalPages || 0);
      setPage(data.number || 0);
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(0); }, []);

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <input className="p-2 border rounded-md" placeholder="키워드" value={q} onChange={(e)=>setQ(e.target.value)} />
          <input className="p-2 border rounded-md" placeholder="지역코드 (예: JEJU)" value={locationCode} onChange={(e)=>setLocationCode(e.target.value)} />
          <input className="p-2 border rounded-md" placeholder="태그 (예: 맛집)" value={tag} onChange={(e)=>setTag(e.target.value)} />
          <input className="p-2 border rounded-md" placeholder="호스트 ID" value={hostId} onChange={(e)=>setHostId(e.target.value)} />
          <button className="h-10 px-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700" onClick={()=>load(0)} disabled={loading}>
            {loading ? "검색중…" : "검색"}
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading && <p className="text-sm text-slate-500">불러오는 중…</p>}
      {!loading && items.length === 0 && (
        <p className="text-sm text-slate-500">검색 결과가 없습니다.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/buddies/${p.id}`}
            className="group block rounded-xl border bg-white p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg group-hover:text-indigo-700">{p.title}</h3>
              <Badge type={p.closed ? "danger" : "success"}>{p.closed ? "마감" : "모집중"}</Badge>
            </div>
            <div className="mt-1 text-sm text-slate-500">{p.locationCode} · {p.address}</div>
            <div className="mt-2 text-sm">기간 {p.startDate} ~ {p.endDate} · 정원 {p.capacity}</div>
            {p.tags?.length ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {p.tags.slice(0, 5).map(t => (
                  <Badge key={t} type="info">#{t}</Badge>
                ))}
              </div>
            ) : null}
            <div className="mt-3 text-xs text-slate-400">작성자: {p.hostUsername || "-"}</div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button className="px-3 py-1.5 rounded-md border bg-white hover:bg-slate-50 disabled:opacity-40" disabled={page<=0} onClick={()=>load(page-1)}>이전</button>
        <span className="text-sm text-slate-600">{page+1} / {Math.max(totalPages,1)}</span>
        <button className="px-3 py-1.5 rounded-md border bg-white hover:bg-slate-50 disabled:opacity-40" disabled={page+1>=totalPages} onClick={()=>load(page+1)}>다음</button>
      </div>
    </div>
  );
}
