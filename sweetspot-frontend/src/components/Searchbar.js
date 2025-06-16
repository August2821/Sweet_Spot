import React, { useState, useEffect } from 'react';
import './Searchbar.css';

function Searchbar({ user, onCategoryChange, onSearchChange, showActionButtons, onRegisterClick, onShareClick, onDeleteClick, showCategory = true, showWriteButton = false, onWriteClick, showPopularButton = false, onPopularClick }) {
  const [selectedCategory, setSelectedCategory] = useState('전체 보기');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // 컴포넌트 마운트 시 또는 user 정보 변경 시 카테고리 리스트 가져오기
  useEffect(() => {
    if (showCategory) {
      fetchCategories();
    }
  }, [showCategory, user]); // user 의존성 추가

  const fetchCategories = async () => {
    console.log('Searchbar - 카테고리 요청 중, 현재 사용자:', user);
    console.log('Searchbar - 사용할 userId:', user?.userId || 3);
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/categories/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.userId || 3 // Use logged-in user's ID or fallback to 3
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('카테고리 리스트:', data); // 디버깅용
        setCategories(data);
      } else {
        console.error('카테고리 로드 실패:', response.status);
        // 실패 시 "카테고리 없음"만 표시
        setCategories([
          { categoryId: 0, name: '카테고리 없음' }
        ]);
            }
          } catch (error) {
            console.error('카테고리 API 요청 실패:', error);
            // 에러 시 "카테고리 없음"만 표시
            setCategories([
        { categoryId: 0, name: '카테고리 없음' }
            ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category, categoryId = null) => {
    setSelectedCategory(category);
    onCategoryChange(category, categoryId);
  };

  const handleSearchInput = (e) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);
    onSearchChange(keyword);
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = () => {
    console.log('Searchbar - 삭제 버튼 클릭됨');
    if (onDeleteClick) {
      onDeleteClick();
    } else {
      console.error('onDeleteClick 함수가 전달되지 않았습니다.');
      alert('삭제 기능이 연결되지 않았습니다.');
    }
  };

  return (
    <div className="searchbar-container">
      {/* 오른쪽: 검색 + 카테고리 + 인기장소 */}
      <div className="searchbar-right">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="검색"
            value={searchTerm}
            onChange={handleSearchInput}
          />
        </div>
        
        {/* 카테고리는 showCategory가 true일 때만 표시 */}
        {showCategory && (
          <div className="dropdown">
            <button
              className="category-button"
              type="button"
              onMouseDown={e => e.preventDefault()}
              disabled={loading}
            >
              {loading ? '로딩중...' : selectedCategory}
            </button>
            <ul className="dropdown-menu">
              {/* 전체 보기는 항상 첫 번째 */}
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={() => handleCategoryClick('전체 보기', null)}
                >
                  전체 보기
                </button>
              </li>
              
              {/* API에서 받아온 카테고리들 */}
              {categories.map((category) => (
                <li key={category.categoryId}>
                  <button 
                    className="dropdown-item" 
                    onClick={() => handleCategoryClick(category.name, category.categoryId)}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 인기장소 버튼 */}
        {showPopularButton && (
          <button 
            className="popular-button" 
            type="button"
            onClick={onPopularClick}
          >
            인기장소
          </button>
        )}
      </div>

      {/* 액션 버튼들 */}
      {showActionButtons && (
        <div className="action-btn-group">
          <button className="action-btn" type="button" onClick={onRegisterClick}>
            등록
          </button>
          <button 
            className="action-btn" 
            type="button" 
            onClick={handleDeleteClick} // 수정된 부분
          >
            삭제
          </button>
          <button className="action-btn" type="button" onClick={onShareClick}>
            공유
          </button>
        </div>
      )}
    </div>
  );
}

export default Searchbar;
