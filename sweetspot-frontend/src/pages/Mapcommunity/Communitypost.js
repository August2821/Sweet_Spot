import React, { useState } from 'react';
import './Communitypost.css';

function Communitypost({ onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      const newPost = {
        id: Date.now(), // 임시 ID
        title: title.trim(),
        content: content.trim(),
        author: '현재사용자', // 실제로는 로그인한 사용자
        date: new Date().toISOString().split('T')[0],
        likes: 0
      };
      onSubmit(newPost);
      setTitle('');
      setContent('');
    } else {
      alert('제목과 내용을 모두 입력해주세요.');
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div className="communitypost-container">
      <div className="communitypost-header">
        <h2>새 글 작성</h2>
        <button className="close-btn" onClick={handleCancel}>×</button>
      </div>

      <form className="communitypost-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            className="title-input"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            className="content-textarea"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
          />
        </div>

        <div className="form-buttons">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            취소
          </button>
          <button type="submit" className="submit-btn">
            등록
          </button>
        </div>
      </form>
    </div>
  );
}

export default Communitypost;