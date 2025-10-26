import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { useState, useEffect } from "react";

function SimpleMap({ onAddressClick }) {
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
    libraries: ["services"],
  });

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [markerPosition, setMarkerPosition] = useState({
    lat: 37.5665,
    lng: 126.978,
  });

  useEffect(() => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(newPosition);
        setMarkerPosition(newPosition);
      });
    }
  }, [map]);

  const handleMapClick = (_, mouseEvent) => {
    const latlng = mouseEvent.latLng;
    const position = {
      lat: latlng.getLat(),
      lng: latlng.getLng(),
    };
    setMarkerPosition(position);

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(position.lng, position.lat, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const address = result[0].address.address_name;
        onAddressClick(address, position.lat, position.lng); // ✅ 좌표까지 전달
      }
    });
  };

  if (loading) return <div>지도를 불러오는 중...</div>;
  if (error) return <div>지도를 불러올 수 없습니다.</div>;

  return (
    <Map
      center={center}
      style={{ width: "100%", height: "100%" }}
      onCreate={setMap}
      onClick={handleMapClick}
    >
      <MapMarker position={markerPosition} />
    </Map>
  );
}

export default SimpleMap;
