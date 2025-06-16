import React, { useState, useEffect } from 'react';
import './PostAdd.css';

export default function PostAdd({ location, onSubmit, onClose, defaultTitle = '', user }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultTitle) {
      setTitle(defaultTitle);
    }
  }, [defaultTitle]);

  useEffect(() => {
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/categories/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.userId || 3
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        if (data.length > 0 && !category) {
          const firstCategory = data[0].name || data[0].categoryName;
          setCategory(firstCategory);
        }
      } else {
        setDefaultCategories();
      }
    } catch (error) {
      console.error('카테고리 API 실패:', error);
      setDefaultCategories();
    } finally {
      setLoading(false);
    }
  };

  const setDefaultCategories = () => {
    const fallback = [
      { categoryId: 1, name: '카페' },
      { categoryId: 2, name: '도서관' },
      { categoryId: 3, name: '음식점' },
      { categoryId: 4, name: '편의점' }
    ];
    setCategories(fallback);
    setCategory(fallback[0].name);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !category || !location?.lat || !location?.lng) {
      setError('모든 필드를 입력하세요.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const selectedCategory = categories.find(cat =>
        (cat.name || cat.categoryName) === category
      );
      if (!selectedCategory) {
        setError('선택된 카테고리를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      // 1. 핀 생성 요청
      const pinData = {
        userId: user?.userId || 3,
        categoryId: selectedCategory.categoryId,
        latitude: location.lat,
        longitude: location.lng,
        title: title.trim(),
        description: description.trim()
      };

      const createForm = new FormData();
      createForm.append('pin', new Blob([JSON.stringify(pinData)], { type: 'application/json' }));

      const pinResponse = await fetch('http://localhost:8080/api/pins/create', {
        method: 'POST',
        body: createForm
      });

      if (!pinResponse.ok) {
        const errorText = await pinResponse.text();
        setError(`핀 생성 실패: ${errorText}`);
        setLoading(false);
        return;
      }

      const pinResult = await pinResponse.json();
      let imageResult = {};

      // 2. 이미지 업로드 요청 (있을 때만)
      if (image) {
        const imageForm = new FormData();
        imageForm.append('info', new Blob([JSON.stringify({ pinId: pinResult.pinId })], { type: 'application/json' }));
        imageForm.append('image', image);

        const imageUploadRes = await fetch('http://localhost:8080/api/pins/images/upload', {
          method: 'POST',
          body: imageForm
        });

        if (!imageUploadRes.ok) {
          const errorText = await imageUploadRes.text();
          console.error('이미지 업로드 실패:', errorText);
          setError('이미지 업로드에 실패했습니다.');
          setLoading(false);
          return;
        }

        imageResult = await imageUploadRes.json();
      }

      const newPost = {
        pinId: pinResult.pinId,
        title: pinResult.title,
        description: pinResult.description,
        category,
        categoryId: selectedCategory.categoryId,
        image: imageResult.imageUrl || null,
        imageId: imageResult.imageId || null,
        location: {
          lat: pinResult.latitude,
          lng: pinResult.longitude
        },
        date: new Date().toISOString().slice(0, 10),
        userId: pinResult.userId
      };

      onSubmit(newPost);
    } catch (error) {
      console.error('요청 중 오류 발생:', error);
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="postdetail-overlay" onClick={onClose}>
      <div className="postdetail-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        <h1 className="post-title">장소 등록</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label><strong>제목</strong></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
              required
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label><strong>사진 추가 (선택사항)</strong></label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {image && (
              <div style={{ marginTop: 8, fontSize: '14px', color: '#666' }}>
                선택된 파일: {image.name}
              </div>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label><strong>상세설명</strong></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: 8, marginTop: 4, minHeight: 80 }}
              required
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label><strong>카테고리</strong></label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
              required
              disabled={loading}
            >
              {loading ? (
                <option value="">카테고리 로딩 중...</option>
              ) : categories.length === 0 ? (
                <option value="">카테고리가 없습니다</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.name || cat.categoryName}>
                    {cat.name || cat.categoryName}
                  </option>
                ))
              )}
            </select>
          </div>
          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
          <button
            type="submit"
            className="action-btn"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? '등록 중...' : '등록하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
