import React, { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import PopularPostsPage from "../PopularPostPage";
import HeatMapExample from '../HeatMapLayer';
import HotSpotSection from '../HotSpotSection';
import 'swiper/css';
import 'swiper/css/pagination';
import {
  Treemap,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import './HomePage.css';

const graphMeta = [
  { id: 1, title: "사용 목적", description: "This statistic explains about the reason why  people use sweet spot. Apperently the reason that people use this web site to searching and finding great places near cbnu." },
  { id: 2, title: "사용자 추이", description: "This statistic explains about use rate during 12 months. It seems like the users more likely use sweet spot during the semester rather than vacation. And also exam weeks are one of the most effective reasons that determine usages of sweet spot. " },
  { id: 3, title: "선호 태그", description: "This statistic show the preferenced tag by users. " }
];

const graphData = {
  1: [
    { name: '나만의 장소 등록', value: 30 },
    { name: '사람들과 공유', value: 20 },
    { name: '꿀장소 서칭', value: 45 },
    { name: '기타', value: 5 }
  ],
  2: [
    { month: '1월', users: 150 },
    { month: '2월', users: 300 },
    { month: '3월', users: 1000 },
    { month: '4월', users: 1500 },
    { month: '5월', users: 400 },
    { month: '6월', users: 500 },
    { month: '7월', users: 200 },
    { month: '8월', users: 700 },
    { month: '9월', users: 1600 },
    { month: '10월', users: 1200 },
    { month: '11월', users: 900 },
    { month: '12월', users: 1000 }
  ],
  3: [
    { tag: '카페', count: 45 },
    { tag: '맛집', count: 50 },
    { tag: '공부', count: 20 },
    { tag: '산책', count: 30 },
    { tag: '공원', count:10 },
    { tag: '빈티지', count: 60 },
    { tag: '감성', count: 60 },
    { tag: '인스타', count: 70 }
  ]
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#8a2be2'];

const CustomizedContent = (props) => {
  const {
    x, y, width, height, index, name, value, colors
  } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: colors[index % colors.length],
          stroke: '#fff',
          strokeWidth: 2,
          cursor: 'pointer'
        }}
      />
      {width > 40 && height > 20 ? (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={14}
          pointerEvents="none"
          dominantBaseline="middle"
        >
          {name} ({value})
        </text>
      ) : null}
    </g>
  );
};

export default function HomePage() {
  const [titleRef1, inView1] = useInView({ triggerOnce: false });
  const [titleRef2, inView2] = useInView({ triggerOnce: false });
  const [selected, setSelected] = useState(graphMeta[0]);
  
  return (
    <div className="container-fluid homepage-container">
      {/* 상단 박스 */}
      <div className="row justify-content-center">
        <div className="row homepage-box g-0">
          <div className="col-md-5 d-flex align-items-center justify-content-center left-box">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <h1>Welcome to SweetSpot!</h1>
              <h3>충북대학교의 숨어 있는 <br />꿀장소를 찾고<br />여러 사람과 함께 공유해 보세요!</h3>
            </motion.div>
          </div>
          <div className="col-md-7 p-0 right-box">
            <Swiper
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              pagination={{ clickable: true }}
              modules={[Autoplay, Pagination]}
              className="h-100"
            >
              <SwiperSlide>
                <img src="/images/HomePage/home1.jpg" className="slide-img" alt="홈배너1" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/HomePage/home2.jpg" className="slide-img" alt="홈배너2" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/HomePage/home3.jpg" className="slide-img" alt="홈배너3" />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>

      {/* 제목 구역 */}
      <div className="row justify-content-center mt-5 hotspot-title-row">
        <motion.div
          ref={titleRef1}
          className="col-md-7 text-start"
          initial={{ opacity: 0, y: 100 }}
          animate={inView1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h1 className="section-title">오늘의 Hot Spot</h1>
        </motion.div>
        <motion.div
          ref={titleRef2}
          className="col-md-5 text-start"
          initial={{ opacity: 0, y: 100 }}
          animate={inView2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          
          <h1 className="section-title">커뮤니티 인기글</h1>
          
        </motion.div>
        
      </div>

      {/* 하단 파란 박스 */}
      <div className="row justify-content-center hotspot-row">
        <div className="col-12 hotspot-box d-flex">
          <motion.div
            className="hotspot-map-box me-2"
            style={{ flex: 7 }}
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1 }}
          >
            <HotSpotSection />
          </motion.div>
          <motion.div
            className="hotspot-posts-box"
            style={{ flex: 5 }}
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1 }}
          >
            <div className="hotspot-post-list">
              <PopularPostsPage />
</div>


          </motion.div>
        </div>
      </div>

      {/* 통계 섹션 */}
      <div className="centered-box">
        <h1>SweetSpot Statistics</h1>
        <p>2025년 상반기 충북대학교 SweetSpot web 사용자를 대상으로 진행된 통계 결과 입니다.</p>
      </div>

      <div className="row justify-content-center mt-5" style={{ display: "flex", gap: "20px" }}>
        {/* 회색 박스 영역 */}
        <div className="col-6 gray-box-wrapper" style={{ flex: 10, marginLeft: "20px" }}>
          <motion.div
            className="animated-box gray-box"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            style={{ height: "400px", padding: "1rem" }}
          >
            {/* 타이틀 */}
            <div style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: "14px", fontWeight: "bold" }}>
              {selected.title}
            </div>

            {/* 그래프 영역 */}
            <div style={{ width: "100%", height: "100%" }}>
              {selected.id === 1 ? (
                <ResponsiveContainer width="100%" height="90%">
                  <Treemap
                    data={graphData[1]}
                    dataKey="value"
                    nameKey="name"
                    stroke="#fff"
                    content={<CustomizedContent colors={COLORS} />}
                  />
                </ResponsiveContainer>
              ) : selected.id === 2 ? (
                <ResponsiveContainer width="100%" height="90%">
                  <ComposedChart data={graphData[2]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" fill="#82ca9d" stroke="#82ca9d" />
                    <Bar dataKey="users" barSize={20} fill="#8884d8" />
                    <Line type="monotone" dataKey="users" stroke="#ff7300" />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : selected.id === 3 ? (
                  <ResponsiveContainer width="100%" height="90%">
                    <ComposedChart
                      layout="vertical"
                      data={graphData[3]}
                      margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="tag" type="category" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#00C49F" barSize={20} />
                    </ComposedChart>
                </ResponsiveContainer>
                            ) : null}
            </div>
          </motion.div>
        </div>

        {/* 오른쪽 네비게이션 영역 */}
        <div className="col-3 nav-box" style={{ flex: 6, display: "flex", flexDirection: "column" }}>
          <div className="button-group" style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            {graphMeta.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                style={{
                  flex: 1,
                  padding: "10px",
                  cursor: "pointer",
                  backgroundColor: selected.id === item.id ? "#00ddff" : "#eee",
                  color: selected.id === item.id ? "#000" : "#666",
                  border: "none",
                  borderRadius: "5px",
                  fontWeight: "bold"
                }}
              >
                {item.title}
              </button>
            ))}
          </div>
          <div
            style={{
              backgroundColor: "#eee",
              borderRadius: "5px",
              padding: "10px",
              height: "30%",
              overflowY: "auto",
              fontSize: "15px",
              lineHeight: "1.4",
              color: "#333"
            }}
          >
            {selected.description}
          </div>
        </div>
      </div>

        <div className="centered-box">
        <h1>All Spots In SweetSpot</h1>
        <p>SweetSpot에 등록된 여러 꿀장소의 위치들을 확인하세요!</p>
      </div>
      {/* 하늘색 박스만 독립적으로 */}
      <div className="row justify-content-center mt-5">
        <div className="col-12 blue-box-wrapper">
          <motion.div
            className="animated-box blue-box"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            style={{ height: '600px' }}
          >
              <HeatMapExample />
            </motion.div>
        </div>
      </div>
    </div>
  );
}
