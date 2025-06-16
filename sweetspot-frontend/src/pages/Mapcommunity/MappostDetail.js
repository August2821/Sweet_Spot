import React, { useState, useEffect } from 'react';
import { Map, MapMarker } from "react-kakao-maps-sdk";
import './MappostDetail.css';

function MappostDetail({ post, user, onClose, isFixed = false }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [postDetail, setPostDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pinInfo, setPinInfo] = useState(null); // 핀 상세 정보
  const [pinLoading, setPinLoading] = useState(false); // 핀 정보 로딩 상태

  // 게시글 상세 정보 가져오기
  useEffect(() => {
    if (post && post.postId) {
      console.log('MappostDetail - 받은 post 객체:', post); // 디버깅
      fetchPostDetail();
    }
  }, [post]);

  const fetchPostDetail = async () => {
    if (!post || !post.postId) return;
    
    setLoading(true);
    setError('');
    try {
      console.log('게시글 상세 요청 시작, postId:', post.postId);
      
      const response = await fetch('http://localhost:8080/api/posts/detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.postId
        })
      });

      console.log('게시글 상세 응답 상태:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('게시글 상세 데이터 전체:', data);
        console.log('게시글의 pinId:', data.pinId); // 중요한 디버깅 포인트
        console.log('게시글의 images:', data.images); // 이미지 디버깅
        
        setPostDetail(data);
        setComments(data.comments || []);
        setLikeCount(data.likes || 0);
        
        // pinId가 있는지 확인하고 핀 정보 가져오기
        if (data.pinId) {
          console.log('pinId가 존재함, 핀 정보 요청 시작:', data.pinId);
          fetchPinInfo(data.pinId);
        } else {
          console.log('pinId가 없음 - 게시글 데이터:', data);
          console.log('post 객체에서 pinId 확인:', post.pinId);
          
          // post 객체에서 pinId를 가져와서 시도
          if (post.pinId) {
            console.log('post 객체의 pinId로 핀 정보 요청:', post.pinId);
            fetchPinInfo(post.pinId);
          }
        }
      } else {
        console.error('게시글 상세 로드 실패:', response.status);
        const errorText = await response.text();
        console.error('에러 내용:', errorText);
        setError('게시글 상세 정보를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 상세 API 요청 실패:', error);
      setError('네트워크 오류로 게시글을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 핀 상세 정보 가져오기
  const fetchPinInfo = async (pinId) => {
    console.log('fetchPinInfo 시작 - pinId:', pinId, 'type:', typeof pinId);
    
    if (!pinId) {
      console.log('pinId가 없어서 핀 정보 요청 중단');
      return;
    }

    setPinLoading(true);
    try {
      console.log('핀 정보 API 요청 시작');
      
      const requestBody = { pinId: Number(pinId) }; // 숫자로 변환
      console.log('핀 정보 요청 body:', requestBody);
      
      const response = await fetch('http://localhost:8080/api/pins/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('핀 정보 응답 상태:', response.status);

      if (response.ok) {
        const pinData = await response.json();
        console.log('핀 정보 수신 성공:', pinData);
        setPinInfo(pinData);
      } else {
        console.error('핀 정보 로드 실패:', response.status);
        const errorData = await response.text();
        console.error('핀 정보 에러 내용:', errorData);
        
        // 에러 상태를 사용자에게 표시하지 않고 로그만 남김
        setPinInfo(null);
      }
    } catch (error) {
      console.error('핀 정보 API 요청 실패:', error);
      setPinInfo(null);
    } finally {
      setPinLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      const commentData = {
        userId: user?.userId || 3,
        postId: post.postId,
        content: comment.trim()
      };

      const response = await fetch('http://localhost:8080/api/comments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData)
      });

      if (response.ok) {
        const newCommentData = await response.json();
        console.log('댓글 등록 성공:', newCommentData);
        
        const formattedComment = {
          commentId: newCommentData.commentId,
          userId: newCommentData.userId,
          nickname: user?.nickname || '현재사용자',
          content: newCommentData.content,
          updatedAt: newCommentData.updatedAt,
          likes: newCommentData.likes
        };
        
        setComments(prevComments => [...prevComments, formattedComment]);
        setComment('');
      } else {
        const errorData = await response.json();
        console.error('댓글 등록 실패:', errorData);
        alert(errorData.error || '댓글 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 등록 네트워크 오류:', error);
      alert('네트워크 오류로 댓글 등록에 실패했습니다.');
    }
  };

  const handleLike = async () => {
    try {
      const likeData = {
        userId: user?.userId || 3,
        postId: post.postId
      };

      const response = await fetch('http://localhost:8080/api/posts/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(likeData)
      });

      if (response.ok) {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
        console.log('좋아요 처리 성공');
      } else {
        const errorData = await response.json();
        console.error('좋아요 처리 실패:', errorData);
        alert(errorData.error || '좋아요 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('좋아요 처리 네트워크 오류:', error);
      alert('네트워크 오류로 좋아요 처리에 실패했습니다.');
    }
  };

  if (!post) return null;

  // 로딩 중이거나 에러가 있을 때의 처리
  if (loading) {
    return (
      <div className={isFixed ? 'mappost-detail-fixed-container' : 'mappost-detail-overlay'}>
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          게시글을 불러오는 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={isFixed ? 'mappost-detail-fixed-container' : 'mappost-detail-overlay'}>
        <div style={{ textAlign: 'center', padding: '50px', color: '#e74c3c' }}>
          {error}
          <button 
            onClick={fetchPostDetail}
            style={{ 
              display: 'block', 
              margin: '10px auto', 
              padding: '8px 16px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const displayPost = postDetail || post;

  // 핀 정보 표시 컴포넌트
  const PinInfoSection = () => {
    console.log('PinInfoSection 렌더링 - pinInfo:', pinInfo, 'pinLoading:', pinLoading);
    
    if (pinLoading) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: '#666',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          📍 핀 정보를 불러오는 중...
        </div>
      );
    }

    if (!pinInfo) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: '#999',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          margin: '20px 0',
          fontSize: '14px'
        }}>
          📍 연관된 핀 정보가 없습니다.
        </div>
      );
    }

    return (
      <div className="mappost-detail-pin-info" style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h4 style={{ marginBottom: '15px', color: '#495057' }}>📍 핀 정보</h4>
        
        <div style={{ marginBottom: '15px' }}>
          <h5 style={{ margin: '0 0 5px 0', color: '#212529' }}>{pinInfo.title}</h5>
          <p style={{ margin: '0', color: '#6c757d', fontSize: '14px' }}>
            {pinInfo.description}
          </p>
        </div>

        {/* 핀 이미지 표시 */}
        {pinInfo.imageInfo && pinInfo.imageInfo.imageUrl && (
          <div style={{ marginBottom: '15px' }}>
            <img 
              src={pinInfo.imageInfo.imageUrl} 
              alt={pinInfo.title}
              style={{ 
                width: '100%', 
                maxHeight: '200px', 
                objectFit: 'cover', 
                borderRadius: '6px',
                border: '1px solid #dee2e6'
              }}
            />
          </div>
        )}

        {/* 지도 표시 */}
        {pinInfo.latitude && pinInfo.longitude && (
          <div style={{ marginBottom: '10px' }}>
            <div style={{ width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden' }}>
              <Map
                center={{ lat: pinInfo.latitude, lng: pinInfo.longitude }}
                style={{ width: '100%', height: '100%' }}
                level={3}
              >
                <MapMarker 
                  position={{ lat: pinInfo.latitude, lng: pinInfo.longitude }}
                />
              </Map>
            </div>
          </div>
        )}

        {/* 핀 상세 정보 */}
        <div style={{ fontSize: '12px', color: '#6c757d' }}>
          {pinInfo.latitude && pinInfo.longitude && (
            <p style={{ margin: '5px 0' }}>
              <strong>위치:</strong> {pinInfo.latitude.toFixed(6)}, {pinInfo.longitude.toFixed(6)}
            </p>
          )}
          {pinInfo.createdAt && (
            <p style={{ margin: '5px 0' }}>
              <strong>생성일:</strong> {new Date(pinInfo.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    );
  };

  // 게시글 이미지 표시 컴포넌트
  const PostImagesSection = () => {
    console.log('PostImagesSection - displayPost.images:', displayPost.images);
    
    if (!displayPost.images || displayPost.images.length === 0) {
      console.log('이미지가 없습니다.');
      return null;
    }

    return (
      <div className="mappost-detail-images" style={{ marginBottom: '20px' }}>
        {displayPost.images.map((image, index) => {
          console.log(`이미지 ${index}:`, image);
          return (
            <div key={image.imageId || index} style={{ marginBottom: '10px' }}>
              <img 
                src={image.imageUrl} 
                alt={`게시글 이미지 ${index + 1}`}
                style={{ 
                  width: '100%', 
                  maxHeight: '400px', 
                  objectFit: 'cover', 
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}
                onLoad={() => console.log(`이미지 로드 성공: ${image.imageUrl}`)}
                onError={(e) => {
                  console.error(`이미지 로드 실패: ${image.imageUrl}`, e);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  // 고정형일 때
  if (isFixed) {
    return (
      <div className="mappost-detail-fixed-container">
        <button className="mappost-detail-close-fixed" onClick={onClose}>×</button>
        
        <div className="mappost-detail-header">
          <h2 className="mappost-detail-title">{displayPost.title}</h2>
          <div className="mappost-detail-meta">
            <span className="mappost-detail-author">{displayPost.nickname || displayPost.author}</span>
            <span className="mappost-detail-date">
              {displayPost.updatedAt ? new Date(displayPost.updatedAt).toISOString().slice(0, 10) : displayPost.date}
            </span>
          </div>
        </div>

        {/* 핀 정보 섹션 */}
        <PinInfoSection />

        {/* 게시글 이미지 표시 */}
        <PostImagesSection />

        <div className="mappost-detail-content">
          {displayPost.content || '내용이 없습니다.'}
        </div>

        <div className="mappost-detail-like">
          <button 
            className={`like-btn ${liked ? 'liked' : ''}`} 
            onClick={handleLike}
          >
            ❤️ {likeCount}
          </button>
        </div>

        <div className="mappost-detail-comments">
          <h3>댓글 ({comments.length})</h3>
          
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              className="comment-input"
              placeholder="댓글을 입력하세요..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows="3"
            />
            <button type="submit" className="comment-submit">댓글 등록</button>
          </form>

          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.commentId || comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">{comment.nickname || comment.author}</span>
                  <span className="comment-date">
                    {comment.updatedAt ? new Date(comment.updatedAt).toISOString().slice(0, 10) : comment.date}
                  </span>
                </div>
                <div className="comment-content">{comment.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 모달 형태
  return (
    <div className="mappost-detail-overlay" onClick={onClose}>
      <div className="mappost-detail-container" onClick={e => e.stopPropagation()}>
        <button className="mappost-detail-close" onClick={onClose}>×</button>
        
        <div className="mappost-detail-header">
          <h2 className="mappost-detail-title">{displayPost.title}</h2>
          <div className="mappost-detail-meta">
            <span className="mappost-detail-author">{displayPost.nickname || displayPost.author}</span>
            <span className="mappost-detail-date">
              {displayPost.updatedAt ? new Date(displayPost.updatedAt).toISOString().slice(0, 10) : displayPost.date}
            </span>
          </div>
        </div>

        {/* 핀 정보 섹션 */}
        <PinInfoSection />

        {/* 게시글 이미지 표시 */}
        <PostImagesSection />

        <div className="mappost-detail-content">
          {displayPost.content || '내용이 없습니다.'}
        </div>

        <div className="mappost-detail-like">
          <button 
            className={`like-btn ${liked ? 'liked' : ''}`} 
            onClick={handleLike}
          >
            ❤️ {likeCount}
          </button>
        </div>

        <div className="mappost-detail-comments">
          <h3>댓글 ({comments.length})</h3>
          
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              className="comment-input"
              placeholder="댓글을 입력하세요..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows="3"
            />
            <button type="submit" className="comment-submit">댓글 등록</button>
          </form>

          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.commentId || comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">{comment.nickname || comment.author}</span>
                  <span className="comment-date">
                    {comment.updatedAt ? new Date(comment.updatedAt).toISOString().slice(0, 10) : comment.date}
                  </span>
                </div>
                <div className="comment-content">{comment.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MappostDetail;