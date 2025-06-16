import React, { useState, useEffect } from 'react';
import './Addbar.css';

function Addbar({ onSearchChange, onRegister, onCancel, user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);

  // 컴포넌트 마운트 시 카테고리 리스트 가져오기
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/categories/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },        body: JSON.stringify({
          userId: user?.userId || 3 // 로그인한 사용자 ID 사용, 없으면 기본값 3
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('카테고리 리스트:', data); // 디버깅용
        setCategories(data);
      } else {
        console.error('카테고리 로드 실패:', response.status);
        // 실패 시 기본 카테고리 사용
        setCategories([
          { categoryId: 1, name: '카페' },
          { categoryId: 2, name: '도서관' },
          { categoryId: 3, name: '음식점' },
          { categoryId: 4, name: '편의점' }
        ]);
      }
    } catch (error) {
      console.error('카테고리 API 요청 실패:', error);
      // 에러 시 기본 카테고리 사용
      setCategories([
        { categoryId: 1, name: '카페' },
        { categoryId: 2, name: '도서관' },
        { categoryId: 3, name: '음식점' },
        { categoryId: 4, name: '편의점' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const searchPlaces = (keyword) => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      alert('지도가 아직 완전히 로드되지 않았습니다.');
      return;
    }
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchResults(data);
        onSearchChange?.(data);
      } else {
        setSearchResults([]);
        onSearchChange?.([]);
      }
    });
  };

  const handleSearchInput = (e) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);
    if (keyword.trim()) searchPlaces(keyword);
    else {
      setSearchResults([]);
      onSearchChange?.([]);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() === '') {
      alert('카테고리 이름을 입력해주세요.');
      return;
    }
    
    // 이미 존재하는 카테고리인지 확인
    const existingCategory = categories.find(cat => cat.name === newCategory.trim());
    if (existingCategory) {
      alert('이미 존재하는 카테고리입니다.');
      return;
    }

    try {
      // API로 카테고리 생성 요청
      const response = await fetch('http://localhost:8080/api/categories/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },        body: JSON.stringify({
          userId: user?.userId || 3,
          name: newCategory.trim()
        })
      });

      const responseData = await response.json();
      
      if (response.ok) {
        console.log('카테고리 생성 성공:', responseData);
        // 성공 시 카테고리 리스트 다시 가져오기
        await fetchCategories();
        setNewCategory('');
        alert(`카테고리 '${responseData.name}'가 추가되었습니다.`);
      } else {
        console.error('카테고리 생성 실패:', responseData);
        if (responseData.error) {
          alert(`카테고리 추가에 실패했습니다: ${responseData.error}`);
        } else {
          alert('카테고리 추가에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('카테고리 추가 네트워크 오류:', error);
      alert('네트워크 오류로 카테고리 추가에 실패했습니다.');
      
      // 네트워크 오류 시 로컬에서 임시로 추가 (선택사항)
      const newId = Math.max(...categories.map(c => c.categoryId), 0) + 1;
      setCategories(prev => [...prev, {
        categoryId: newId,
        name: newCategory.trim(),
        createdAt: new Date().toISOString()
      }]);
      setNewCategory('');
    }
  };
  const handleDeleteCategory = async (categoryToDelete) => {
    // window.confirm을 명시적으로 사용하여 ESLint 에러 해결
    if (!window.confirm(`'${categoryToDelete.name}' 카테고리를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      // API로 카테고리 삭제 요청
      const response = await fetch('http://localhost:8080/api/categories/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },        body: JSON.stringify({
          categoryId: categoryToDelete.categoryId,
          userId: user?.userId || 3
        })
      });

      const responseData = await response.json();

      if (response.ok && responseData.message) {
        // 성공 시 카테고리 리스트 다시 가져오기
        await fetchCategories();
        alert(`카테고리 '${categoryToDelete.name}'가 삭제되었습니다.`);
      } else {
        console.error('카테고리 삭제 실패:', responseData);
        if (responseData.error) {
          alert(`카테고리 삭제에 실패했습니다: ${responseData.error}`);
        } else {
          alert('카테고리 삭제에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('카테고리 삭제 네트워크 오류:', error);
      alert('네트워크 오류로 카테고리 삭제에 실패했습니다.');
      
      // 네트워크 오류 시 로컬에서 임시로 삭제 (선택사항)
      setCategories(categories.filter(cat => cat.categoryId !== categoryToDelete.categoryId));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  return (
    <div className={`addbar-wrapper ${showCategoryList ? 'expanded' : ''}`}>
      <div className="addbar-container">
        <div className="addbar-left">
          <div className="addbar-input-wrapper">
            <input
              type="text"
              className="addbar-input"
              placeholder="장소 검색"
              value={searchTerm}
              onChange={handleSearchInput}
            />
          </div>
        </div>

        <div className="addbar-right">
          <button className="action-btn primary" onClick={onRegister}>
            등록하기
          </button>
          <button className="action-btn secondary" onClick={onCancel}>
            취소하기
          </button>
          <button 
            className={`category-manage-btn ${showCategoryList ? 'active' : ''}`}
            onClick={() => setShowCategoryList(!showCategoryList)}
            disabled={loading}
          >
            {loading ? '로딩중...' : '카테고리 관리'}
          </button>
        </div>
      </div>

      {showCategoryList && (
        <div className="category-section">
          <div className="category-add-form">
            <input
              type="text"
              className="category-input"
              placeholder="새 카테고리 입력"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="add-btn" onClick={handleAddCategory}>
              추가
            </button>
          </div>
          
          <div className="category-list">
            <h4 className="category-title">카테고리 목록</h4>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                카테고리를 불러오는 중...
              </div>
            ) : (
              <div className="category-grid">
                {categories.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    등록된 카테고리가 없습니다.
                  </div>
                ) : (
                  categories.map((category) => (
                    <div key={category.categoryId} className="category-item">
                      <span className="category-name">{category.name}</span>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteCategory(category)}
                        title="카테고리 삭제"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Addbar;
