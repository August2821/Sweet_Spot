// pages/PopularPostsPage.js

import React, { useEffect, useState } from 'react';
import Mapcompost from './Mapcommunity/Mapcompost';

function PopularPostPage() {
  const [popularPosts, setPopularPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPopularPosts();
  }, []);

  const fetchPopularPosts = async () => {
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
          pins: post.pins
        }));
        setPopularPosts(formattedPosts);
      } else {
        setError('인기 게시글을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popular-post-page">
      {loading ? (
        <p>불러오는 중...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : popularPosts.length === 0 ? (
        <p>인기 게시글이 없습니다.</p>
      ) : (
        popularPosts.map(post => (
          <Mapcompost key={post.id} post={post} onClick={() => {}} />
        ))
      )}
    </div>
  );
}

export default PopularPostPage;