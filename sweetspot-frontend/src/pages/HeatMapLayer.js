import React from "react";
import { MapContainer, TileLayer, Tooltip, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import { useMap } from "react-leaflet";

const HeatmapLayer = ({ points }) => {
  const map = useMap();

  React.useEffect(() => {
    const heatLayer = L.heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 10,
      max: 1,
    gradient: {
    0.0: '#00efff',  // 하늘색 (6자리)
    0.5: '#00afff',  // 조금 더 진한 파랑
    1.0: '#009fff'   // 진한 파랑
    }

    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};

// 히트맵 데이터 (넓은 범위, 10개 포인트 예시)
const heatData = [
  [36.6283, 127.4584, 1],
  [36.6250, 127.4590, 0.8],
  [36.6200, 127.4582, 0.6],
  [36.6290, 127.4550, 0.7],
  [36.6330, 127.4500, 0.5],
  [36.6350, 127.4530, 0.9],
];

function HeatMapExample() {
  return (
    <MapContainer
      center={[36.6283, 127.4584]}
      zoom={13}  // 16에서 더 멀리 보이게 조절
      style={{ height: "90%", width: "90%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* 히트맵 레이어 */}
      <HeatmapLayer points={heatData} />

      {/* 히트맵 점마다 CircleMarker + Tooltip 추가 (hover 시 정보 보여주기) */}
      {heatData.map(([lat, lng, intensity], idx) => (
        <CircleMarker
          key={idx}
          center={[lat, lng]}
          radius={10}
          fillColor="red"
          fillOpacity={0}
          stroke={false}
          eventHandlers={{
            mouseover: (e) => {
              e.target.openTooltip();
            },
            mouseout: (e) => {
              e.target.closeTooltip();
            }
          }}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
            {`선호도: ${intensity}`}
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

export default HeatMapExample;
