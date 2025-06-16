import React from 'react';
import './Mapcompost.css';

function Mapcompost({ post, onClick }) {
  return (
    <div className="mapcompost-container" onClick={onClick}>
      <div className="mapcompost-title">{post.title}</div>
      <div className="mapcompost-meta">
        <span className="mapcompost-author">{post.author}</span>
        <span className="mapcompost-date">{post.date}</span>
      </div>
      <div className="mapcompost-likes">
        ❤️ {post.likes || 0}
      </div>
    </div>
  );
}

export default Mapcompost;