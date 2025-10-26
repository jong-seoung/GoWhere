import { useEffect, useState } from "react";
import api from "../services/api"; // Axios 인스턴스
import SearchBar from "./SearchBar";
import SortBar from "./SortBar";

export default function PostList() {
  const [params, setParams] = useState({
    sort: "createdAt",
    dir: "desc",
    page: 0,
    size: 12,
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 여행 목록 불러오기
  const load = async (over = {}) => {
    setLoading(true);
    setError("");
    try {
      const merged = { ...params, ...over };
      setParams(merged);

      // ✅ 여행 목록 가져오기
      const res = await api.get("/api/travelplan");
      setData(res.data);
    } catch (e) {
      console.error(e);
      setError(
        e?.response?.data?.message || e.message || "여행 목록 불러오기 실패"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-4">
        <SearchBar onSearch={(over) => load(over)} />
        <SortBar
          sort={params.sort}
          dir={params.dir}
          onChange={(over) => load({ ...over, page: 0 })}
        />
      </div>

      {loading && <div className="p-4">불러오는 중...</div>}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
              아직 등록된 여행이 없습니다 ✈️
            </div>
          ) : (
            data.map((trip) => (
              <div
                key={trip.id}
                className="card hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">{trip.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {trip.description || "설명 없음"}
                </p>
                <p className="text-sm text-gray-500">
                  🗓 {trip.startDate} ~ {trip.endDate}
                </p>
                <p className="text-sm text-gray-500">📍 {trip.destination}</p>
                <p className="text-sm text-blue-600 font-medium mt-2">
                  {trip.tripType}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
