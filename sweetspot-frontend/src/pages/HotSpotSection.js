import React, { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import dummyPosts from '../data/dummyPosts';
import './HotSpotSection.css';

function HotspotSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const CBNU_CENTER = { lat: 36.6287, lng: 127.4560 };

  useEffect(() => {
    fetchHotspotPosts();
  }, []);

  const fetchHotspotPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8080/api/posts/popular');
      if (response.ok) {
        const data = await response.json();
        const formattedPosts = data.map(post => ({
          id: post.postId,
          title: post.title,
          pins: post.pins ?? []
        }));
        setPosts(formattedPosts);
      } else {
        console.warn('API 실패, 더미 데이터 사용');
        fallbackToDummy();
      }
    } catch (e) {
      console.warn('네트워크 오류, 더미 데이터 사용');
      fallbackToDummy();
    } finally {
      setLoading(false);
    }
  };

  const fallbackToDummy = () => {
    const dummy = dummyPosts
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5)
      .map(post => ({
        id: post.postId,
        title: post.title,
        pins: post.pins ?? [{
          pinId: post.pinId || post.postId,
          latitude: 36.6287 + Math.random() * 0.005,
          longitude: 127.4560 + Math.random() * 0.005
        }]
      }));
    setPosts(dummy);
  };

  return (
    <div className="hotspot-map-wrapper">
      <div className="hotspot-map">
        {loading ? (
          <p>지도를 불러오는 중...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <Map
            center={CBNU_CENTER}
            style={{ width: '100%', height: '400px', borderRadius: '12px' }}
            level={4}
          >
            {posts.flatMap(post =>
              post.pins.map(pin => (
                <MapMarker
                  key={`${post.id}-${pin.pinId}`}
                  position={{ lat: pin.latitude, lng: pin.longitude }}
                  title={post.title} // hover 시 제목 표시
                />
              ))
            )}
          </Map>
        )}
      </div>
    </div>
  );
}

export default HotspotSection;
