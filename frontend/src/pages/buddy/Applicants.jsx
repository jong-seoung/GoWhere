import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BuddyAppAPI } from "../../api/buddy";
import MainLayout from "../../components/layout/MainLayout";

export default function Applicants() {
  const { id: postId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await BuddyAppAPI.applicantsForPost(Number(postId));
      setItems(data || []);
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [postId]);

  const changeStatus = async (applicationId, status) => {
    try {
      await BuddyAppAPI.updateStatus(applicationId, status);
      load();
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    }
  };

  return (
    <MainLayout className="p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-3">신청자 목록(글 ID: {postId})</h1>
        {loading && <p>불러오는 중…</p>}
        <ul className="space-y-3">
          {items.map((a) => (
            <li key={a.id} className="p-3 border rounded bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">신청 ID #{a.id}</div>
                  <div className="text-sm text-gray-500">신청자: {a.applicantUsername || a.applicantId}</div>
                  <div className="text-sm">메시지: {a.message}</div>
                  <div className="text-xs text-gray-400">상태: {a.status} · 신청일: {a.appliedAt?.replace("T", " ")}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border rounded" onClick={() => changeStatus(a.id, "APPROVED")}>승인</button>
                  <button className="px-3 py-1 border rounded" onClick={() => changeStatus(a.id, "REJECTED")}>거절</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {!loading && items.length === 0 && (
          <p className="text-sm text-slate-500 mt-3">신청자가 없습니다.</p>
        )}
      </div>
    </MainLayout>
  );
}
