import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import api from "../services/api";

const Write = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    tripType: "",
    departure: "",
    destination: "",
    departureLat: null,
    departureLng: null,
    destinationLat: null,
    destinationLng: null,
  });

  // ✅ sessionStorage 복원
  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem("writeFormPatch"));
    if (saved) setFormData((prev) => ({ ...prev, ...saved }));
  }, []);

  // ✅ 지도에서 돌아올 때 데이터 반영
  useEffect(() => {
    const mapData = location.state;
    if (mapData && mapData.selectedAddress) {
      setFormData((prev) => ({
        ...prev,
        ...(mapData.field === "departure"
          ? {
              departure: mapData.selectedAddress,
              departureLat: mapData.lat,
              departureLng: mapData.lng,
            }
          : {
              destination: mapData.selectedAddress,
              destinationLat: mapData.lat,
              destinationLng: mapData.lng,
            }),
      }));
    }
  }, [location.state]);

  // ✅ 입력 시 상태 및 sessionStorage 업데이트
  const handleChange = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    sessionStorage.setItem("writeFormPatch", JSON.stringify(updated));
  };

  // ✅ 지도 열기
  const openMap = (field) => {
    sessionStorage.setItem("writeFormPatch", JSON.stringify(formData));
    navigate("/kakaomap", { state: { field } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/travelplan", formData);
      alert("여행 등록 완료 ✅");
      sessionStorage.removeItem("writeFormPatch");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "등록 실패. 콘솔에서 에러를 확인하세요.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">새 여행 등록</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="제목"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />

          <textarea
            name="description"
            placeholder="상세 설명"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

          <div className="flex gap-3">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="border p-2 rounded w-1/2"
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="border p-2 rounded w-1/2"
            />
          </div>

          <select
            name="tripType"
            value={formData.tripType}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">여행 유형 선택</option>
            <option value="국내여행">국내여행</option>
            <option value="해외여행">해외여행</option>
            <option value="캠핑">캠핑</option>
            <option value="당일치기">당일치기</option>
            <option value="기타">기타</option>
          </select>

          {/* ✅ 출발지 */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="departure"
              placeholder="출발지를 입력하세요"
              value={formData.departure}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <button
              type="button"
              onClick={() => openMap("departure")}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              <FiSearch size={18} />
            </button>
          </div>

          {/* ✅ 목적지 */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="destination"
              placeholder="목적지를 입력하세요"
              value={formData.destination}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <button
              type="button"
              onClick={() => openMap("destination")}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              <FiSearch size={18} />
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold mt-4"
          >
            등록하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default Write;
