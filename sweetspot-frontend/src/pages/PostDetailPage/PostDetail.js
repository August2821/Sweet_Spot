import React, { useState, useEffect } from 'react';
import './PostDetail.css';

export default function PostDetail({ post, onClose }) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    if (post) {
      setSelectedRating(0);
      setSubmitted(false);
    }
  }, [post]);

  if (!post) return null;

  const handleRating = (rating) => {
    setSelectedRating(rating);
    setSubmitted(true);
  };

  return (
    <div className="postdetail-overlay" onClick={onClose}>
      <div className="postdetail-popup" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="post-header">
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* 제목 */}
        <div className="post-title-section">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span className="post-date">📅 {post.date}</span>
            {post.category && <span className="post-category">{post.category}</span>}
          </div>
        </div>

        {/* 이미지 */}
        <div className="postdetail-image-section">
          {(post.image || post.originalImage) ? (
            <div className="main-image-container">
              <img 
                src={post.image || post.originalImage} 
                alt={post.title}
                className="main-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = `
                    <div class="image-placeholder">
                      <div class="placeholder-icon">🖼️</div>
                      <p>이미지를 불러올 수 없습니다</p>
                    </div>
                  `;
                }}
              />
            </div>
          ) : (
            <div className="image-placeholder">
              <div className="placeholder-icon">🖼️</div>
              <p>이미지가 없습니다</p>
            </div>
          )}
        </div>

        {/* 설명 */}
        <div className="post-description-section">
          <h3>상세 설명</h3>
          <div className="description-content">
            <p>{post.description || '설명이 없습니다.'}</p>
          </div>
        </div>

        {/* 핀 정보 */}
        {post.pinData && (
          <div className="pin-info-section">
            <h4>📍 핀 정보</h4>
            <div className="pin-details">
              {post.pinData.pinId && <p><strong>핀 ID:</strong> {post.pinData.pinId}</p>}
              {post.category && <p><strong>카테고리:</strong> {post.category}</p>}
              {post.pinData.createdAt && (
                <p><strong>생성일:</strong> {new Date(post.pinData.createdAt).toLocaleDateString()}</p>
              )}
              {post.pinData.latitude && post.pinData.longitude && (
                <p><strong>좌표:</strong> {post.pinData.latitude.toFixed(6)}, {post.pinData.longitude.toFixed(6)}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
