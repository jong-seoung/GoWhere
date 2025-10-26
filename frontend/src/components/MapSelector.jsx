import { useEffect } from "react";

const MapSelector = ({ onSelect }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY}&libraries=services,places`;
    script.async = true;
    script.onload = () => {
      const container = document.getElementById("map");
      const options = { center: new window.kakao.maps.LatLng(37.5665, 126.9780), level: 3 };
      const map = new window.kakao.maps.Map(container, options);

      // 클릭 시 마커 생성
      const marker = new window.kakao.maps.Marker();
      window.kakao.maps.event.addListener(map, "click", function (mouseEvent) {
        const latlng = mouseEvent.latLng;
        marker.setPosition(latlng);
        marker.setMap(map);

        // 좌표를 상위 컴포넌트로 전달
        onSelect && onSelect({
          lat: latlng.getLat(),
          lng: latlng.getLng(),
        });
      });
    };
    document.head.appendChild(script);
  }, []);

  return <div id="map" className="w-full h-[400px] rounded-lg shadow-md" />;
};

export default MapSelector;
