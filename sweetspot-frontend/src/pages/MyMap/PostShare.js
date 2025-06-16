import React, { useState, useEffect } from 'react';
import './PostAdd.css';

export default function PostShare({ location, onSubmit, onClose, defaultTitle = '', user }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultTitle) {
      setTitle(defaultTitle);
    }
  }, [defaultTitle]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('제목을 입력하세요.');
      return;
    }
    if (!image) {
      setError('사진을 1장 추가하세요.');
      return;
    }
    if (!description.trim()) {
      setError('상세설명을 입력하세요.');
      return;
    }
    if (!location || !location.pinId) {
      setError('핀 정보가 없습니다.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      console.log('=== 게시글 공유 시작 ===');
      
      // 1단계: 게시글 생성 API 호출
      const postData = {
        userId: user?.userId || 3,
        pinId: location.pinId,
        title: title.trim(),
        content: description.trim()
      };

      console.log('1단계 - 게시글 생성 요청:', postData);

      const postResponse = await fetch('http://localhost:8080/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      });

      console.log('1단계 - 게시글 생성 응답 상태:', postResponse.status);

      if (!postResponse.ok) {
        const errorText = await postResponse.text();
        console.error('1단계 - 게시글 생성 실패:', errorText);
        throw new Error(`게시글 생성 실패: ${postResponse.status}`);
      }

      const postResult = await postResponse.json();
      console.log('1단계 - 게시글 생성 성공:', postResult);

      // 2단계: 이미지 업로드 API 호출 (수정된 부분)
      console.log('2단계 - 이미지 업로드 시작');
      
      const formData = new FormData();
      
      // JSON 데이터를 Blob으로 변환해서 추가
      const infoBlob = new Blob([JSON.stringify({
        postId: postResult.postId
      })], {
        type: 'application/json'
      });
      
      formData.append('info', infoBlob);
      formData.append('image', image);

      console.log('2단계 - 이미지 업로드 요청 데이터:', {
        postId: postResult.postId,
        fileName: image.name,
        fileSize: image.size
      });

      const imageResponse = await fetch('http://localhost:8080/api/posts/images/upload', {
        method: 'POST',
        body: formData
        // Content-Type 헤더를 명시적으로 설정하지 않음 (브라우저가 자동으로 multipart/form-data로 설정)
      });

      console.log('2단계 - 이미지 업로드 응답 상태:', imageResponse.status);

      if (!imageResponse.ok) {
        const errorText = await imageResponse.text();
        console.error('2단계 - 이미지 업로드 실패:', errorText);
        throw new Error(`이미지 업로드 실패: ${imageResponse.status}`);
      }

      const imageResult = await imageResponse.json();
      console.log('2단계 - 이미지 업로드 성공:', imageResult);

      const newPost = {
        postId: postResult.postId,
        title: postResult.title,
        content: postResult.content,
        image: imageResult.imageUrl,
        imageId: imageResult.imageId,
        pinId: postResult.pinId,
        userId: postResult.userId,
        likes: postResult.likes || 0,
        updatedAt: postResult.updatedAt,
        date: new Date().toISOString().slice(0, 10),
      };

      console.log('=== 게시글 공유 완료 ===', newPost);
      onSubmit(newPost);
      
    } catch (error) {
      console.error('게시글 공유 중 오류 발생:', error);
      setError(error.message || '네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="postdetail-overlay" onClick={onClose}>
      <div className="postdetail-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} disabled={loading}>
          X
        </button>
        <h1 className="post-title">장소 공유</h1>
        
        {location && (
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            <strong>선택된 핀:</strong> ID {location.pinId} (위도: {location.lat}, 경도: {location.lng})
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label><strong>제목</strong></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
              placeholder="게시글 제목을 입력하세요"
              required
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label><strong>사진 추가 (1장)</strong></label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginTop: 4 }}
              required
              disabled={loading}
            />
            {image && (
              <div style={{ marginTop: 8, fontSize: '14px', color: '#666' }}>
                선택된 파일: {image.name} ({(image.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
            {imagePreview && (
              <div style={{ marginTop: 8 }}>
                <img 
                  src={imagePreview} 
                  alt="미리보기" 
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '200px', 
                    objectFit: 'cover',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }} 
                />
              </div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label><strong>상세설명</strong></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: 8, marginTop: 4, minHeight: 80 }}
              placeholder="게시글 내용을 입력하세요"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div style={{ 
              color: 'red', 
              marginBottom: 12, 
              padding: '8px', 
              backgroundColor: '#ffebee',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="action-btn" 
            style={{ 
              width: '100%',
              backgroundColor: loading ? '#00ddff' : 'ccc',
              cursor: loading ? 'not-allowed' : 'pointer',
              color: '#fff',
            }}
            disabled={loading}
          >
            {loading ? '공유 중...' : '공유 하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
