// src/pages/buddy/BuddyList.jsx
export default function BuddyList() {
const [items, setItems] = useState([]);
const [page, setPage] = useState(0);
const [totalPages, setTotalPages] = useState(0);
const [loading, setLoading] = useState(false);
const [q, setQ] = useState("");
const [location, setLocation] = useState("");
const [tag, setTag] = useState("");
const [hostId, setHostId] = useState("");

const load = async (p = 0) => {
setLoading(true);
try {
const { data } = await BuddyPostAPI.search({ q, location, tag, hostId, page: p, size: 10 });
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
<div className="max-w-4xl mx-auto p-4">
<h1 className="text-2xl font-bold mb-4">동행 모집글</h1>

<div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
<input className="input input-bordered p-2 border rounded" placeholder="키워드(q)" value={q} onChange={e=>setQ(e.target.value)} />
<input className="input input-bordered p-2 border rounded" placeholder="지역(locationCode)" value={location} onChange={e=>setLocation(e.target.value)} />
<input className="input input-bordered p-2 border rounded" placeholder="태그(tag)" value={tag} onChange={e=>setTag(e.target.value)} />
<input className="input input-bordered p-2 border rounded" placeholder="호스트 ID" value={hostId} onChange={e=>setHostId(e.target.value)} />
</div>
<div className="flex gap-2 mb-4">
<button className="px-3 py-2 rounded border" onClick={()=>load(0)} disabled={loading}>검색</button>
<Link to="/buddy/new" className="px-3 py-2 rounded border">모집글 작성</Link>
<Link to="/buddy/my-applications" className="px-3 py-2 rounded border">내 신청 내역</Link>
</div>

{loading && <p>불러오는 중…</p>}

<ul className="space-y-3">
{items.map((p) => (
<li key={p.id} className="p-3 border rounded">
<div className="flex items-center justify-between">
<div>
<Link to={`/buddy/posts/${p.id}`} className="font-semibold text-lg">{p.title}</Link>
<div className="text-sm text-gray-500">{p.locationCode} · {p.address}</div>
<div className="text-sm">기간 {p.startDate} ~ {p.endDate} · 정원 {p.capacity} · 상태 {p.closed ? "마감" : "모집중"}</div>
</div>
<div className="text-xs text-gray-400">작성자: {p.hostUsername || "-"}</div>
</div>
</li>
))}
</ul>

<div className="mt-4 flex gap-2">
<button className="px-3 py-1 border rounded" disabled={page<=0} onClick={()=>load(page-1)}>이전</button>
<span className="px-2">{page+1} / {Math.max(totalPages,1)}</span>
<button className="px-3 py-1 border rounded" disabled={page+1>=totalPages} onClick={()=>load(page+1)}>다음</button>
</div>
</div>
);
}