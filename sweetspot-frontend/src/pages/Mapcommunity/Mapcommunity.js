import React, { useState, useEffect } from 'react';
import Mapcompost from './Mapcompost';
import MappostDetail from './MappostDetail';
import Communitypost from './Communitypost';
import Searchbar from '../../components/Searchbar';
import dummyPosts from '../../data/dummyPosts';
import './Mapcommunity.css';

function Mapcommunity({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);  const [selectedCategory, setSelectedCategory] = useState('전체 보기');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [viewMode, setViewMode] = useState('all'); // 'all' 또는 'popular'

  // 컴포넌트 마운트 시 게시글 목록 가져오기
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
  setLoading(true);
  setError('');
  try {
    const response = await fetch('http://localhost:8080/api/posts/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('게시글 목록:', data);
      const formattedPosts = data.map(post => ({
        id: post.postId,
        title: post.title,
        author: post.nickname,
        date: new Date(post.updatedAt).toISOString().slice(0, 10),
        content: `작성자: ${post.nickname}`,
        likes: post.likes,
        postId: post.postId,
        userId: post.userId,
        updatedAt: post.updatedAt
      }));
      setPosts(formattedPosts);
      setViewMode('all'); // ✅ 이 줄에서 줄바꿈
    } else {
      console.error('게시글 로드 실패:', response.status);
      setError('게시글을 불러오는데 실패했습니다.');
      console.log('API 실패 - 더미 데이터 사용');
      const formattedDummyPosts = dummyPosts.map(post => ({
        id: post.postId,
        title: post.title,
        author: post.nickname,
        date: new Date(post.updatedAt).toISOString().slice(0, 10),
        content: post.content,
        likes: post.likes,
        postId: post.postId,
        userId: post.userId,
        updatedAt: post.updatedAt
      }));
      setPosts(formattedDummyPosts);
      setError('');
      setViewMode('all');
    }
  } catch (error) {
    console.error('게시글 API 요청 실패:', error);
    setError('네트워크 오류로 게시글을 불러올 수 없습니다.');
    console.log('네트워크 오류 - 더미 데이터 사용');
    const formattedDummyPosts = dummyPosts.map(post => ({
      id: post.postId,
      title: post.title,
      author: post.nickname,
      date: new Date(post.updatedAt).toISOString().slice(0, 10),
      content: post.content,
      likes: post.likes,
      postId: post.postId,
      userId: post.userId,
      updatedAt: post.updatedAt
    }));
    setPosts(formattedDummyPosts);
    setError('');
    setViewMode('all');
  } finally {
    setLoading(false);
  }
};


  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowWriteForm(false);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (keyword) => {
    setSearchKeyword(keyword);
  };

  const handleWriteClick = () => {
    setShowWriteForm(true);
    setSelectedPost(null);
  };

  const handleCloseWriteForm = () => {
    setShowWriteForm(false);
  };  const handleSubmitPost = async (newPost) => {
    // 새 글 작성 후 게시글 목록 다시 가져오기
    await fetchPosts();
    setShowWriteForm(false);
    // 새로 작성한 글이 목록의 맨 위에 있을 것으로 예상되므로 첫 번째 게시글 선택
    setTimeout(() => {
      if (posts.length > 0) {
        setSelectedPost(posts[0]);
      }
    }, 100);
  };

  const handlePopularClick = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8080/api/posts/popular', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('인기 게시글 목록:', data);
        // API 데이터를 기존 형식에 맞게 변환
        const formattedPosts = data.map(post => ({
          id: post.postId,
          title: post.title,
          author: post.nickname,
          date: new Date(post.updatedAt).toISOString().slice(0, 10),
          content: `작성자: ${post.nickname}`,
          likes: post.likes,
          postId: post.postId,
          userId: post.userId,
          updatedAt: post.updatedAt,
          pins: post.pins // 핀 정보 추가
        }));
        setPosts(formattedPosts);
        setSelectedPost(null); // 선택된 게시글 초기화
      } else {
        console.error('인기 게시글 로드 실패:', response.status);
        setError('인기 게시글을 불러오는데 실패했습니다.');
        
        // API 실패 시 더미 데이터에서 인기 게시글 필터링 (좋아요 수 기준)
        console.log('API 실패 - 더미 데이터에서 인기 게시글 사용');
        const popularDummyPosts = dummyPosts
          .sort((a, b) => b.likes - a.likes) // 좋아요 수 내림차순 정렬
          .slice(0, 5) // 상위 5개만 선택
          .map(post => ({
            id: post.postId,
            title: post.title,
            author: post.nickname,
            date: new Date(post.updatedAt).toISOString().slice(0, 10),
            content: post.content,
            likes: post.likes,
            postId: post.postId,
            userId: post.userId,
            updatedAt: post.updatedAt,
            pins: [{ pinId: post.pinId, latitude: 36.6287, longitude: 127.4560 }] // 더미 핀 정보
          }));
        setPosts(popularDummyPosts);
        setError(''); // 더미 데이터가 있으면 에러 상태 해제
      }
    } catch (error) {
      console.error('인기 게시글 API 요청 실패:', error);
      setError('네트워크 오류로 인기 게시글을 불러올 수 없습니다.');
      
      // 네트워크 오류 시에도 더미 데이터에서 인기 게시글 사용
      console.log('네트워크 오류 - 더미 데이터에서 인기 게시글 사용');
      const popularDummyPosts = dummyPosts
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5)
        .map(post => ({
          id: post.postId,
          title: post.title,
          author: post.nickname,
          date: new Date(post.updatedAt).toISOString().slice(0, 10),
          content: post.content,
          likes: post.likes,
          postId: post.postId,
          userId: post.userId,
          updatedAt: post.updatedAt,
          pins: [{ pinId: post.pinId, latitude: 36.6287, longitude: 127.4560 }]
        }));
      setPosts(popularDummyPosts);
      setError(''); // 더미 데이터가 있으면 에러 상태 해제
    } finally {
      setLoading(false);
    }
  };

  // 필터링된 게시글 목록
  const filteredPosts = posts.filter(post => {
    const matchSearch = post.title.includes(searchKeyword) || post.content.includes(searchKeyword);
    return matchSearch;
  });

  return (
    <div className="mapcommunity-wrapper">      {/* Searchbar - 커뮤니티용 설정 */}      <Searchbar 
        user={user}
        onSearchChange={handleSearchChange}
        showActionButtons={false}
        showCategory={false}
        showWriteButton={true}
        onWriteClick={handleWriteClick}
        onPopularClick={handlePopularClick}
      />
      
      {/* 메인 콘텐츠 영역 */}
      <div className="mapcommunity-container">        {/* 왼쪽: 게시글 목록 */}
        <div className="mapcommunity-left">
          <div className="mapcommunity-list">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                게시글을 불러오는 중...
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#e74c3c' }}>
                {error}
                <button 
                  onClick={fetchPosts}
                  style={{ 
                    display: 'block', 
                    margin: '10px auto', 
                    padding: '8px 16px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  다시 시도
                </button>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                {searchKeyword ? '검색 결과가 없습니다.' : '게시글이 없습니다.'}
              </div>
            ) : (
              filteredPosts.map(post => (
                <Mapcompost 
                  key={post.id} 
                  post={post} 
                  onClick={() => handlePostClick(post)}
                />
              ))
            )}
          </div>
        </div>

        {/* 오른쪽: 선택된 게시글 상세 또는 글 작성 폼 */}
        <div className="mapcommunity-right">
          {showWriteForm ? (
            <Communitypost 
              onClose={handleCloseWriteForm}
              onSubmit={handleSubmitPost}
            />
          ) : selectedPost ? (
            <div className="post-detail-fixed">              <MappostDetail 
                post={selectedPost} 
                user={user}
                onClose={() => setSelectedPost(null)}
                isFixed={true}
              />
            </div>
          ) : (
            <div className="no-post-selected">
              <p>게시글을 선택해주세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Mapcommunity;