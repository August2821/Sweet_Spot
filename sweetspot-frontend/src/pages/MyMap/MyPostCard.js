import React from 'react';
import './MyPostCard.css';

export default function PostCard({
  id,
  title,
  description,
  image,
  likes,
  date,
  category,
  checked = false,
  onCheck,
  onClickCard,
  onDetailClick
}) {
  const handleDetailClick = (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    if (onDetailClick) {
      onDetailClick();
    }
  };

  return (
    <div
      className="postcard"
      onClick={() => onClickCard && onClickCard()}
      style={{ cursor: 'pointer' }}
    >
      {/* 체크박스 */}
      <input
        type="checkbox"
        className="postcard-checkbox"
        checked={checked}
        onChange={(e) => {
          e.stopPropagation(); // 카드 클릭 방지
          if (onCheck) {
            onCheck(id, e.target.checked);
          }
        }}
      />

      {/* 이미지 */}
      <img
        src={image || "/images/default.jpg"}
        alt={title}
        className="postcard-image"
      />

      {/* 내용 */}
      <div className="postcard-content">
        <div className="postcard-header">
          <h3>{title}</h3>
          <span style={{ fontSize: "14px", color: "gray" }}>{category}</span>
        </div>
        <p>{description}</p>
        <div className="postcard-footer">
          <span className="postcard-detail" onClick={handleDetailClick}>
            상세보기
          </span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}
