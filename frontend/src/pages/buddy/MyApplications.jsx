import { useEffect, useState } from "react";
import { BuddyAppAPI } from "../../api/buddy";
import MainLayout from "../../components/layout/MainLayout";

export default function MyApplications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await BuddyAppAPI.myApplications();
      setItems(data || []);
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!confirm("신청을 취소하시겠습니까?")) return;
    try {
      await BuddyAppAPI.cancel(id);
      load();
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    }
  };

  return (
    <MainLayout className="p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-3">내 신청 내역</h1>
        {loading && <p>불러오는 중…</p>}
        <ul className="space-y-3">
          {items.map((a) => (
            <li key={a.id} className="p-3 border rounded flex items-center justify-between bg-white">
              <div>
                <div className="font-semibold">신청 ID #{a.id}</div>
                <div className="text-sm text-gray-500">상태: {a.status} · 메시지: {a.message}</div>
                <div className="text-xs text-gray-400">신청일시: {a.appliedAt?.replace("T", " ")}</div>
              </div>
              <button className="px-3 py-1 border rounded" onClick={() => cancel(a.id)}>취소</button>
            </li>
          ))}
        </ul>
        {!loading && items.length === 0 && (
          <p className="text-sm text-slate-500 mt-3">신청 내역이 없습니다.</p>
        )}
      </div>
    </MainLayout>
  );
}
