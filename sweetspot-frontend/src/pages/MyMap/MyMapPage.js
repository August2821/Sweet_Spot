import React, { useEffect, useState, useRef } from 'react';
import './MyMap.css';
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Searchbar from '../../components/Searchbar';
import PostCard from './MyPostCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import Addbar from './Addbar';
import PostAdd from './PostAdd';
import PostShare from './PostShare';
import PostDetail from '../PostDetailPage/PostDetail';

const CBNU_LOCATION = {
  lat: 36.6287,
  lng: 127.4560,
};

function KakaoMap({ center, markers = [] }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => setIsLoaded(true));
    }
  }, []);

  useEffect(() => {
    if (
      isLoaded &&
      mapRef.current &&
      center &&
      typeof center.lat === 'number' &&
      typeof center.lng === 'number'
    ) {
      const map = mapRef.current;
      const currentCenter = map.getCenter();
      const newCenter = new window.kakao.maps.LatLng(center.lat, center.lng);

      if (
        currentCenter.getLat() !== center.lat ||
        currentCenter.getLng() !== center.lng
      ) {
        // 부드럽게 이동
        map.panTo(newCenter);
      }
    }
  }, [center, isLoaded]);

  if (!isLoaded || !center || typeof center.lat !== 'number' || typeof center.lng !== 'number') {
    return <div>지도를 불러오는 중입니다...</div>;
  }

  return (
    <Map
      center={CBNU_LOCATION}
      style={{ width: '100%', height: '100%' }}
      level={3}
      onCreate={(map) => {
        mapRef.current = map;
      }}
    >
      {markers.map((marker) => (
        <MapMarker
          key={marker.id}
          position={marker.location}
          onClick={marker.onClick}
        />
      ))}
    </Map>
  );
}

export default function MapPage({ user }) {
  const [selectedLocation, setSelectedLocation] = useState(CBNU_LOCATION);
  const [selectedCategory, setSelectedCategory] = useState("전체 보기");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showAddbar, setShowAddbar] = useState(false);
  const [showPostAdd, setShowPostAdd] = useState(false);
  const [showPostShare, setShowPostShare] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);
  const [lastClickedPlaceName, setLastClickedPlaceName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [checkedPostId, setCheckedPostId] = useState(null);
  const [allPins, setAllPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [postList, setPostList] = useState([]);

  // 사용자 정보 확인 및 초기 데이터 로드
  useEffect(() => {
    console.log('MyMapPage - 현재 사용자:', user);
    if (user) {
      console.log('MyMapPage - 사용자 ID:', user.userId);
      initializeData();
    } else {
      console.log('MyMapPage - 로그인하지 않은 사용자');
    }
  }, [user]);

  // 초기 데이터 로드 함수
  const initializeData = async () => {
    setLoading(true);
    try {
      await fetchCategories();
    } catch (error) {
      console.error('초기 데이터 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 목록을 가져오고 모든 카테고리의 핀을 로드하는 함수
  const fetchCategories = async () => {
    if (!user || !user.userId) return;
    
    try {
      const response = await fetch('http://localhost:8080/api/categories/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userId,
        })
      });

      console.log('fetchCategories 응답 status:', response.status);
      const categoriesData = await response.json();
      console.log('fetchCategories 응답 데이터:', categoriesData);

      if (response.ok) {
        setCategories(categoriesData);
        // 카테고리 로드 후 모든 카테고리의 핀 데이터 로드
        await fetchAllPins(categoriesData);
      } else {
        console.error('카테고리 목록 로드 실패:', response.status, categoriesData);
        setCategories([]);
      }
    } catch (error) {
      console.error('카테고리 목록 로드 네트워크 오류:', error);
      setCategories([]);
    }
  };

  // 모든 카테고리의 핀을 가져오는 함수
  const fetchAllPins = async (categoriesData) => {
    if (!categoriesData || categoriesData.length === 0) {
      setAllPins([]);
      return;
    }

    try {
      const allPinsData = [];
      
      // 각 카테고리별로 핀 데이터를 가져와서 통합
      for (const category of categoriesData) {
        try {
          const response = await fetch('http://localhost:8080/api/pins/list', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              categoryId: category.categoryId,
            })
          });

          if (response.ok) {
            const pinsData = await response.json();
            if (Array.isArray(pinsData)) {
              // 각 핀에 카테고리 정보 추가
              const pinsWithCategory = pinsData.map(pin => ({
                ...pin,
                categoryName: category.name,
                categoryId: category.categoryId
              }));
              allPinsData.push(...pinsWithCategory);
            }
          } else {
            console.error(`카테고리 ${category.categoryId}의 핀 로드 실패:`, response.status);
          }
        } catch (error) {
          console.error(`카테고리 ${category.categoryId}의 핀 로드 오류:`, error);
        }
      }

      console.log('모든 핀 데이터:', allPinsData);
      setAllPins(allPinsData);
    } catch (error) {
      console.error('모든 핀 로드 오류:', error);
      setAllPins([]);
    }
  };

  // 특정 카테고리의 핀만 가져오는 함수 (카테고리 선택 시 사용)
  const fetchPinsByCategory = async (categoryId) => {
    console.log('fetchPinsByCategory 호출됨, categoryId:', categoryId);
    // 이미 모든 핀 데이터가 있으므로 필터링만 수행
    // 필요에 따라 새로 요청할 수도 있음
  };

  const handleRegisterClick = () => setShowAddbar(true);
  const handleCancelAddbar = () => setShowAddbar(false);

  // 공유하기 클릭 핸들러
  const handleShareClick = () => {
    if (!checkedPostId) {
      alert('공유할 포스트를 선택해주세요.');
      return;
    }
    const checkedPost = getDisplayPostList().find(post => post.id === checkedPostId);
    if (checkedPost) {
      setPendingLocation({
        pinId: checkedPost.pinId || checkedPost.id,
        lat: checkedPost.location.lat,
        lng: checkedPost.location.lng
      });
      setShowPostShare(true);
    }
  };

  // 삭제 클릭 핸들러 추가
  const handleDeleteClick = async () => {
    if (!checkedPostId) {
      alert('삭제할 포스트를 선택해주세요.');
      return;
    }

    // 선택된 포스트 찾기
    const checkedPost = getDisplayPostList().find(post => post.id === checkedPostId);
    if (!checkedPost) {
      alert('선택된 포스트를 찾을 수 없습니다.');
      return;
    }

    // 핀 데이터에서 온 포스트인지 확인
    if (!checkedPost.pinData || !checkedPost.pinId) {
      alert('핀 데이터만 삭제할 수 있습니다.');
      return;
    }

    // 삭제 확인
    const confirmDelete = window.confirm(`"${checkedPost.title}" 핀을 삭제하시겠습니까?`);
    if (!confirmDelete) {
      return;
    }

    setLoading(true);
    try {
      console.log('핀 삭제 요청 시작:', {
        pinId: checkedPost.pinId,
        userId: user?.userId || 3
      });

      const response = await fetch('http://localhost:8080/api/pins/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pinId: checkedPost.pinId,
          userId: user?.userId || 3
        })
      });

      console.log('핀 삭제 응답 상태:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('핀 삭제 성공:', result);
        
        alert('핀이 성공적으로 삭제되었습니다.');
        
        // 체크 상태 초기화
        setCheckedPostId(null);
        
        // 데이터 새로고침
        await fetchCategories();
        
      } else {
        const errorData = await response.json();
        console.error('핀 삭제 실패:', errorData);
        alert(errorData.error || '핀 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('핀 삭제 네트워크 오류:', error);
      alert('네트워크 오류로 핀 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostShare = (newPost) => {
    console.log('게시글 공유 성공:', newPost);
    setShowPostShare(false);
    setCheckedPostId(null);
    alert('게시글이 성공적으로 공유되었습니다!');
  };

  const handleClosePostShare = () => {
    setShowPostShare(false);
  };

  const handleResultClick = (place) => {
    const lat = parseFloat(place.y);
    const lng = parseFloat(place.x);
    if (!isNaN(lat) && !isNaN(lng)) {
      setSelectedLocation({ lat, lng });
      setPendingLocation({ lat, lng });
      setLastClickedPlaceName(place.place_name);
    }
  };

  const handleRegister = () => {
    if (pendingLocation) {
      setSelectedLocation(pendingLocation);
      setShowPostAdd(true);
    }
  };

  const handlePostAdd = (newPost) => {
    // 로컬 상태 업데이트 로직을 제거하고 바로 새로고침
    setShowPostAdd(false);
    setShowAddbar(false);
    
    // 등록 완료 후 페이지 새로고침
    window.location.reload();
  };

  const handleClosePostAdd = () => setShowPostAdd(false);
  const handleDetailClick = (post) => {
    console.log("상세보기 클릭됨:", post);
    
    // 핀 데이터에서 온 포스트인 경우 더 상세한 정보 구성
    if (post.pinData) {
      const enhancedPost = {
        ...post,
        // PostDetail에서 사용할 수 있는 추가 정보
        location: {
          lat: post.pinData.latitude,
          lng: post.pinData.longitude
        },
        // 핀 생성일을 날짜로 사용
        date: new Date(post.pinData.createdAt).toLocaleDateString(),
        // 핀의 원본 이미지 정보
        originalImage: post.pinData.imageInfo?.imageUrl,
        // 더미 평점 데이터 (실제 구현 시 API에서 가져와야 함)
        ratings: {
          5: Math.floor(Math.random() * 10) + 1,
          4: Math.floor(Math.random() * 8) + 1,
          3: Math.floor(Math.random() * 5) + 1,
          2: Math.floor(Math.random() * 3),
          1: Math.floor(Math.random() * 2)
        },
        // 좋아요 수 (기본값 설정)
        likes: post.likes || Math.floor(Math.random() * 20)
      };
      setSelectedPost(enhancedPost);
    } else {
      // 일반 포스트의 경우 기존 데이터 사용
      const enhancedPost = {
        ...post,
        // 평점 데이터가 없으면 더미 데이터 추가
        ratings: post.ratings || {
          5: Math.floor(Math.random() * 10) + 1,
          4: Math.floor(Math.random() * 8) + 1,
          3: Math.floor(Math.random() * 5) + 1,
          2: Math.floor(Math.random() * 3),
          1: Math.floor(Math.random() * 2)
        }
      };
      setSelectedPost(enhancedPost);
    }
  };

  const handlePostCheck = (postId, isChecked) => {
    if (isChecked) {
      setCheckedPostId(postId);
    } else {
      setCheckedPostId(null);
    }
  };

  // 카테고리가 변경될 때 호출되는 함수
  const handleCategoryChange = (category, categoryId) => {
    setSelectedCategory(category);
    setSelectedCategoryId(categoryId);
    console.log('카테고리 변경:', category, categoryId);
  };

  // 핀 데이터를 PostCard 형태로 변환하는 함수
  const convertPinToPostCard = (pin) => {
    return {
      id: `pin-${pin.pinId}`,
      title: pin.title,
      description: pin.description,
      image: pin.imageInfo?.imageUrl || null,
      location: { lat: pin.latitude, lng: pin.longitude },
      likes: 0,
      date: new Date(pin.createdAt).toLocaleDateString(),
      category: pin.categoryName || "기타",
      pinId: pin.pinId,
      pinData: pin
    };
  };

  // 표시할 포스트 목록 생성
  const getDisplayPostList = () => {
    let displayList = [];
    
    // 기존 포스트들 필터링
    const filteredPostList = postList.filter((post) => {
      const matchCategory = selectedCategory === "전체 보기" || post.category === selectedCategory;
      const matchSearch = post.title.includes(searchKeyword) || post.description.includes(searchKeyword);
      return matchCategory && matchSearch;
    });
    
    displayList = [...filteredPostList];
    
    // 핀 데이터 필터링 및 변환
    const filteredPins = allPins.filter(pin => {
      // 카테고리 필터링
      const matchCategory = selectedCategory === "전체 보기" || pin.categoryName === selectedCategory;
      // 검색어 필터링
      const matchSearch = pin.title.includes(searchKeyword) || pin.description.includes(searchKeyword);
      return matchCategory && matchSearch;
    });
    
    const pinPostCards = filteredPins.map(convertPinToPostCard);
    displayList = [...displayList, ...pinPostCards];
    
    return displayList;
  };

  const displayPostList = getDisplayPostList();

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>데이터를 불러오는 중...</div>;
  }

  return (
    <>
      {!showAddbar ? (
        <Searchbar
          user={user}
          onCategoryChange={handleCategoryChange}
          onSearchChange={setSearchKeyword}
          showCategory={true}
          showActionButtons={true}
          onRegisterClick={handleRegisterClick}
          onShareClick={handleShareClick}
          onDeleteClick={handleDeleteClick} // 삭제 핸들러 추가
        />
      ) : (
        <Addbar
          onSearchChange={setSearchResults}
          onRegister={handleRegister}
          onCancel={handleCancelAddbar}
          user={user}
        />
      )}

      {showPostAdd && (
        <PostAdd
          location={pendingLocation}
          defaultTitle={lastClickedPlaceName}
          onSubmit={handlePostAdd}
          onClose={handleClosePostAdd}
          user={user}
        />
      )}

      {showPostShare && (
        <PostShare
          location={pendingLocation}
          onSubmit={handlePostShare}
          onClose={handleClosePostShare}
          user={user}
        />
      )}

      <div className="container-box">
        <div className="post-box">
          <div className="post-list-scroll">
            {showAddbar ? (
              searchResults.length > 0 ? (
                <ul className="search-result-list">
                  {searchResults.map((place, index) => (
                    <li
                      key={place.id || index}
                      style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #eee' }}
                      onClick={() => handleResultClick(place)}
                    >
                      <strong>{place.place_name}</strong><br />
                      <span style={{ fontSize: '13px', color: '#555' }}>{place.address_name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ color: '#888', padding: '20px', textAlign: 'center' }}>
                  검색 결과가 없습니다.
                </div>
              )
            ) : (
              displayPostList.length > 0 ? (
                displayPostList.map((post) => (
                  <PostCard
                    key={post.id}
                    {...post}
                    checked={checkedPostId === post.id}
                    onCheck={handlePostCheck}
                    onClickCard={() => setSelectedLocation(post.location)}
                    onDetailClick={() => handleDetailClick(post)}
                  />
                ))
              ) : (
                <div style={{ color: '#888', padding: '20px', textAlign: 'center' }}>
                  표시할 포스트가 없습니다.
                </div>
              )
            )}
          </div>
        </div>

        <div className="map-box">
          <KakaoMap
            center={selectedLocation}
            markers={
              showAddbar
                ? searchResults.map((place, index) => {
                    const lat = parseFloat(place.y);
                    const lng = parseFloat(place.x);
                    if (isNaN(lat) || isNaN(lng)) return null;
                    return {
                      id: place.id || `search-${index}`,
                      location: { lat, lng },
                      onClick: () => handleResultClick(place),
                    };
                  }).filter(Boolean)
                : [
                    // 기존 포스트들
                    ...displayPostList
                      .filter(post => !post.pinData)
                      .map((post) => ({
                        id: `post-${post.id}`,
                        location: post.location,
                        onClick: () => {
                          setSelectedLocation(post.location);
                          setSelectedPost(post);
                          setSelectedPin(null);
                        }
                      })),
                    // 표시되는 핀들만 지도에 표시
                    ...displayPostList
                      .filter(post => post.pinData)
                      .map((post) => ({
                        id: `pin-${post.pinId}`,
                        location: post.location,
                        onClick: () => {
                          setSelectedLocation(post.location);
                          setSelectedPin(post.pinData);
                          setSelectedPost(null);
                        }
                      }))
                  ]
            }
          />
        </div>
      </div>

      {selectedPost && (
        <PostDetail
          post={selectedPost}
          onClose={() => {
            console.log("PostDetail 닫기");
            setSelectedPost(null);
          }}
        />
      )}

      {selectedPin && (
        <div className="pin-detail-overlay" onClick={() => setSelectedPin(null)}>
          <div className="pin-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pin-detail-header">
              <h3>{selectedPin.title}</h3>
              <button 
                className="pin-detail-close" 
                onClick={() => setSelectedPin(null)}
              >
                ×
              </button>
            </div>
            <div className="pin-detail-content">
              <p className="pin-description">{selectedPin.description}</p>
              {selectedPin.imageInfo && (
                <div className="pin-image">
                  <img 
                    src={selectedPin.imageInfo.imageUrl} 
                    alt={selectedPin.title}
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                  />
                </div>
              )}
              <div className="pin-info">
                <p><strong>카테고리:</strong> {selectedPin.categoryName}</p>
                <p><strong>위도:</strong> {selectedPin.latitude}</p>
                <p><strong>경도:</strong> {selectedPin.longitude}</p>
                <p><strong>생성일:</strong> {new Date(selectedPin.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}