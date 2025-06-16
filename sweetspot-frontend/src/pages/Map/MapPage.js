import React, { useEffect, useRef, useState } from 'react';
import './Map.css';
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Searchbar from '../../components/Searchbar';
import PostCard from './PostCard';
import PostDetail from '../PostDetailPage/PostDetail';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function MapPage({ user }) {
  // 충북대학교 좌표
  const CBNU_LOCATION = {
    lat: 36.6287,
    lng: 127.4560,
  };

  const [selectedLocation, setSelectedLocation] = useState(CBNU_LOCATION);
  const [selectedCategory, setSelectedCategory] = useState("전체 보기");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        setIsLoaded(true);
      });
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      const newCenter = new window.kakao.maps.LatLng(
        selectedLocation.lat,
        selectedLocation.lng
      );
      mapRef.current.panTo(newCenter); // 지도 중심 이동
    }
  }, [selectedLocation]);

  const postList = [
    {
      id: 1,
      title: "도서관",
      description: "도서관 위치입니다.",
      image: "/images/library.jpg",
      ratings: { 5: 4, 4: 3, 3: 2 },
      location: { lat: 36.6281, lng: 127.4555 },
      likes: 12,
      date: "2025-05-29",
      category: "문화시설"
    },
    {
      id: 2,
      title: "스타벅스",
      description: "맛있는 커피!",
      image: "/images/starbucks.jpg",
      ratings: { 5: 8, 4: 2, 1: 1 },
      location: { lat: 36.6278, lng: 127.4580 },
      likes: 5,
      date: "2025-05-29",
      category: "카페"
    },
  ];

  const filteredPostList = postList.filter((post) => {
    const matchCategory = selectedCategory === "전체 보기" || post.category === selectedCategory;
    const matchSearch = post.title.includes(searchKeyword) || post.description.includes(searchKeyword);
    return matchCategory && matchSearch;
  });

  if (!isLoaded) return <div>지도를 불러오는 중입니다...</div>;

  return (
    <>      <Searchbar
        user={user}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchKeyword}
        showCategory={true}
        showActionButtons={false}
        showPopularButton={true}
        onPopularClick={() => alert('인기장소 클릭!')}
      />

      <div className="container-box">
        <div className="post-box">
          <div className="post-list-scroll">
            {filteredPostList.map((post) => (
              <PostCard
                key={post.id}
                {...post}
                onClickCard={() => {
                  setSelectedLocation(post.location); // 지도 중심 이동만
                }}
                onClickDetail={() => {
                  setSelectedPost(post);             // 상세보기만
                }}
              />
            ))}
          </div>
        </div>

        <div className="map-box">
          <Map
            center={CBNU_LOCATION} // 초기 지도 중심 = 충북대
            style={{ width: '100%', height: '100%' }}
            level={3}
            onCreate={(map) => {
              mapRef.current = map;
            }}
          >
            {filteredPostList.map((post) => (
              <MapMarker
                key={post.id}
                position={post.location}
                onClick={() => {
                  setSelectedPost(post);
                  setSelectedLocation(post.location);
                }}
              />
            ))}
          </Map>
        </div>
      </div>

      <PostDetail
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </>
  );
}
