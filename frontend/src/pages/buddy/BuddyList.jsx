import { useEffect, useState } from "react";
import { BuddyPostAPI, BuddyAppAPI } from "../../api/buddy";
import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";

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
  const [location, setLocation] = useState("");
  const [tag, setTag] = useState("");
  const [hostId, setHostId] = useState("");

  const [applyOpen, setApplyOpen] = useState(false);
  const [applyTarget, setApplyTarget] = useState(null);
  const [applyMsg, setApplyMsg] = useState("");

  const openApply = (post) => {
    if (post.closed) {
      alert("마감된 모집글입니다.");
      return;
    }
    setApplyTarget(post);
    setApplyMsg("");
    setApplyOpen(true);
  };

  const submitApply = async () => {
    try {
      await BuddyAppAPI.apply(Number(applyTarget.id), applyMsg);
      alert("신청 완료");
      setApplyOpen(false);
      setApplyMsg("");
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    }
  };

  const load = async (p = 0) => {
    setLoading(true);
    try {
      const { data } = await BuddyPostAPI.search({ q, hostId, page: p, size: 8 });
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
    <MainLayout className="p-4">
      <div className="max-w-6xl mx-auto space-y-4">

        {/* 검색바 */}
        <div className="rounded-xl border bg-white p-4 grid grid-cols-1 md:grid-cols-5 gap-2">
          <input className="border rounded p-2" placeholder="검색어" value={q} onChange={(e)=>setQ(e.target.value)} />
          <input className="border rounded p-2" placeholder="지역코드" value={location} onChange={(e)=>setLocation(e.target.value)} />
          <input className="border rounded p-2" placeholder="태그" value={tag} onChange={(e)=>setTag(e.target.value)} />
          <input className="border rounded p-2" placeholder="작성자 ID" value={hostId} onChange={(e)=>setHostId(e.target.value)} />
          <button className="border rounded p-2" onClick={()=>load(0)}>검색</button>
        </div>

        {/* 목록 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((p) => (
            <div key={p.id} className="group rounded-xl border bg-white p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <Link to={`/buddies/${p.id}`} className="font-semibold text-lg group-hover:text-indigo-700">
                  {p.title}
                </Link>
                <Badge type={p.closed ? "danger" : "success"}>{p.closed ? "마감" : "모집중"}</Badge>
              </div>
              <div className="mt-1 text-sm text-slate-500">{p.locationCode} · {p.address}</div>
              <div className="mt-2 text-sm">기간 {p.startDate} ~ {p.endDate} · 정원 {p.capacity}</div>
              {p.tags?.length ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.tags.slice(0, 5).map(t => <Badge key={t} type="info">#{t}</Badge>)}
                </div>
              ) : null}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>작성자: {p.hostUsername || "-"}</span>
                <div className="flex gap-2">
                  <Link to={`/buddies/${p.id}`} className="px-2.5 py-1 rounded-md border bg-white hover:bg-slate-50 text-slate-700">
                    상세
                  </Link>
                  <button
                    className="px-2.5 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40"
                    onClick={() => openApply(p)}
                    disabled={p.closed}
                  >
                    신청
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center gap-2">
          <button className="border rounded px-3 py-1" disabled={page<=0} onClick={()=>load(page-1)}>이전</button>
          <span className="px-2 py-1 text-sm"> {page+1} / {Math.max(1, totalPages)} </span>
          <button className="border rounded px-3 py-1" disabled={page>=totalPages-1} onClick={()=>load(page+1)}>다음</button>
        </div>
      </div>

      {/* 빠른 신청 모달 */}
      {applyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold">신청하기</h3>
            <p className="mt-1 text-sm text-slate-500">
              대상: <span className="font-medium">{applyTarget?.title}</span>
            </p>
            <textarea
              className="mt-3 w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              rows={4}
              placeholder="메시지를 입력하세요"
              value={applyMsg}
              onChange={(e) => setApplyMsg(e.target.value)}
            />
            <div className="mt-3 flex justify-end gap-2">
              <button className="px-3 py-2 rounded-md border bg-white hover:bg-slate-50" onClick={() => setApplyOpen(false)}>
                취소
              </button>
              <button className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700" onClick={submitApply}>
                신청 보내기
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
