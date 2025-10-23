// src/pages/buddy/BuddyPostDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { BuddyPostAPI, BuddyAppAPI } from "../../api/buddy";

export default function BuddyPostDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [toggling, setToggling] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await BuddyPostAPI.get(id);
      setP(data);
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const apply = async () => {
    try {
      await BuddyAppAPI.apply(Number(id), message); // ✅ body: { message }
      alert("신청 완료");
      setMessage("");
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    }
  };

  const toggleClosed = async () => {
    if (!p) return;
    setToggling(true);
    try {
      const next = !p.closed;
      const { data } = await BuddyPostAPI.changeStatus(p.id, next);
      setP(data);
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally {
      setToggling(false);
    }
  };

  const remove = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await BuddyPostAPI.remove(p.id);
      alert("삭제됨");
      nav("/buddies");
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    }
  };

  if (loading) return <div className="p-4">불러오는 중…</div>;
  if (!p) return <div className="p-4">데이터 없음</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{p.title}</h1>
        <span className={`px-2 py-1 text-sm border rounded ${p.closed ? "bg-gray-100" : "bg-green-50"}`}>
          {p.closed ? "마감" : "모집중"}
        </span>
      </div>

      <div className="text-sm text-gray-500">
        {p.locationCode} · {p.address} · by {p.hostUsername || "-"}
      </div>

      <div className="whitespace-pre-wrap border p-3 rounded">{p.content}</div>

      <div className="text-sm">기간 {p.startDate} ~ {p.endDate} · 정원 {p.capacity}</div>

      {p.tags?.length ? <div className="text-sm">태그: {p.tags.join(", ")}</div> : null}

      <div className="flex gap-2">
        <button className="px-3 py-2 border rounded" onClick={toggleClosed} disabled={toggling}>
          {toggling ? "변경 중…" : "상태 토글"}
        </button>
        <Link to={`/buddies/${p.id}/applicants`} className="px-3 py-2 border rounded">신청자 목록</Link>
        <button className="px-3 py-2 border rounded" onClick={remove}>삭제</button>
      </div>

      <div className="border rounded p-3 space-y-2">
        <h2 className="font-semibold">이 모집글에 신청하기</h2>
        <textarea
          className="w-full border p-2 rounded"
          rows={3}
          placeholder="메시지"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="px-3 py-2 border rounded" onClick={apply} disabled={!message.trim()}>
          신청
        </button>
      </div>
    </div>
  );
}
