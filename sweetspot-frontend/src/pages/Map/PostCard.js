import React from 'react';
import './PostCard.css';

export default function PostCard({
  id, title, description, image, date, category,
  ratings,
  onClickCard,        // ✅ 카드 바디 클릭 시
  onClickDetail       // ✅ 상세보기 클릭 시
}) {
  let avgRating = null;
  if (ratings) {
    const total = Object.entries(ratings).reduce(
      (acc, [star, count]) => {
        acc.sum += Number(star) * count;
        acc.count += count;
        return acc;
      },
      { sum: 0, count: 0 }
    );
    avgRating = total.count ? (total.sum / total.count).toFixed(1) : null;
  }

  return (
    <div className="postcard" onClick={onClickCard} style={{ cursor: 'pointer' }}>
      <img src={image} alt={title} className="postcard-image" />
      <div className="postcard-content">
        <div className="postcard-header">
          <h3>{title}</h3>
          <span style={{ fontSize: "14px", color: "gray" }}>{category}</span>
        </div>
        <p>{description}</p>
        <div className="postcard-footer">
          <span className="postcard-rating">
            {avgRating ? `⭐ ${avgRating}` : '평점 없음'}
          </span>
          <span
            className="postcard-detail"
            onClick={(e) => {
              e.stopPropagation(); // 부모 div 클릭 막기
              onClickDetail();     // 상세보기 클릭
            }}
          >
            상세보기
          </span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}