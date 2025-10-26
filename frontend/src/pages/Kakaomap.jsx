import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { FiArrowLeft, FiCheck } from "react-icons/fi";

const Kakaomap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const field = location.state?.field || "departure"; // 출발지 / 목적지 구분

  const [markerPosition, setMarkerPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 }); // 기본 서울 좌표

  // ✅ 카카오 맵 SDK 불러오기 (환경 변수 수정)
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY, // ✅ 수정됨!
    libraries: ["services"],
  });

  // ✅ 현재 위치로 지도 초기화
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const current = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setMapCenter(current);
          setMarkerPosition(current);
        },
        () => console.warn("⚠️ 현재 위치 정보를 불러올 수 없습니다.")
      );
    }
  }, []);

  // ✅ 지도 클릭 시 좌표 + 주소 설정
  const handleMapClick = (_, mouseEvent) => {
    const latlng = mouseEvent.latLng;
    const pos = { lat: latlng.getLat(), lng: latlng.getLng() };
    setMarkerPosition(pos);

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(pos.lng, pos.lat, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const addr = result[0].address.address_name;
        setAddress(addr);
      }
    });
  };

  // ✅ 선택 완료 버튼 클릭 시 write로 이동 + 데이터 병합
  const handleConfirm = () => {
    if (!markerPosition || !address) {
      alert("지도를 클릭하여 위치를 선택해주세요!");
      return;
    }

    const current = JSON.parse(sessionStorage.getItem("writeFormPatch")) || {};

    const updated = {
      ...current,
      ...(field === "departure"
        ? {
            departure: address,
            departureLat: markerPosition.lat,
            departureLng: markerPosition.lng,
          }
        : {
            destination: address,
            destinationLat: markerPosition.lat,
            destinationLng: markerPosition.lng,
          }),
    };

    sessionStorage.setItem("writeFormPatch", JSON.stringify(updated));
    navigate("/write");
  };

  if (loading) return <div className="text-center mt-20">🗺️ 지도를 불러오는 중...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">❌ 지도를 불러올 수 없습니다.</div>;

  return (
    <div className="flex flex-col h-screen">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between bg-blue-600 text-white px-6 py-4 shadow-md">
        <button
          onClick={() => navigate("/write")}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <FiArrowLeft size={18} /> 뒤로가기
        </button>

        <h2 className="text-lg font-semibold">
          {field === "departure" ? "출발지 선택" : "목적지 선택"}
        </h2>

        <button
          onClick={handleConfirm}
          className="flex items-center gap-2 bg-white text-blue-600 px-4 py-1.5 rounded-md hover:bg-gray-100 transition"
        >
          <FiCheck /> 선택 완료
        </button>
      </div>

      {/* 지도 영역 */}
      <div className="flex-1 relative">
        <Map
          center={mapCenter}
          style={{ width: "100%", height: "100%" }}
          level={4}
          onClick={handleMapClick}
        >
          {markerPosition && (
            <MapMarker position={markerPosition}>
              <div style={{ color: "#000", fontSize: "13px" }}>
                {address || "선택된 위치"}
              </div>
            </MapMarker>
          )}
        </Map>

        {/* 선택한 주소 표시 */}
        {address && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-md border px-4 py-2 rounded-md text-gray-800">
            📍 {address}
          </div>
        )}
      </div>
    </div>
  );
};

export default Kakaomap;
