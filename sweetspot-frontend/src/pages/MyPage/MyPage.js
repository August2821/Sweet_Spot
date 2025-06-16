import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import './MyPage.css';

export default function MyPage({ user }) {
  const [userInfo, setUserInfo] = useState({
    email: user?.email || '',
    password: '',
    phoneNumber: user?.phoneNumber || '',
    nickname: user?.nickname || '',
    profileImageUrl: user?.profileImageUrl || '',
  });
  const [posts, setPosts] = useState(user?.posts || []);
  const [comments, setComments] = useState(user?.comments || []);
  const [likedPosts, setLikedPosts] = useState(user?.likedPosts || []);
  const [likedComments, setLikedComments] = useState(user?.likedComments || []);
  const [isProfileControlsOpen, setProfileControlsOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    posts: false,
    comments: false,
    likedPosts: false,
    likedComments: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activityData = [
    { date: '2025-06-01', posts: 2, comments: 5 },
    { date: '2025-06-02', posts: 1, comments: 3 },
    { date: '2025-06-03', posts: 4, comments: 2 },
    { date: '2025-06-04', posts: 3, comments: 4 },
    { date: '2025-06-05', posts: 5, comments: 6 },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!user && storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserInfo({
        email: parsed.email,
        phoneNumber: parsed.phoneNumber,
        nickname: parsed.nickname,
        profileImageUrl: parsed.profileImageUrl,
        password: '',
      });
    }
  }, [user]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const userId = user?.userId || user?.id;
    if (!userId) return alert('사용자 정보가 없습니다.');

    const formData = new FormData();
    formData.append('file', file);
    const userJson = JSON.stringify({ userId });
    formData.append('user', new Blob([userJson], { type: 'application/json' }));

    try {
      const response = await axios.post('/update/image', formData, { withCredentials: true });
      const updatedImageUrl = response.data.url;
      setUserInfo((prev) => ({ ...prev, profileImageUrl: updatedImageUrl }));
      localStorage.setItem('user', JSON.stringify({ ...user, profileImageUrl: updatedImageUrl }));
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      alert('프로필 이미지 업로드에 실패했습니다.');
    }
  };

  const handleImageDelete = async () => {
    const userId = user?.userId || user?.id;
    if (!userId) return alert('사용자 정보가 없습니다.');

    try {
      await axios.post('/image/delete', { userId }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      setUserInfo((prev) => ({ ...prev, profileImageUrl: '' }));
      localStorage.setItem('user', JSON.stringify({ ...user, profileImageUrl: '' }));
    } catch (error) {
      console.error('프로필 이미지 삭제 실패:', error);
      alert('프로필 이미지 삭제에 실패했습니다.');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`/api/posts/${postId}`, { withCredentials: true });
      setPosts(posts.filter((p) => p.postId !== postId));
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${commentId}`, { withCredentials: true });
      setComments(comments.filter((c) => c.commentId !== commentId));
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  return (
    <div className="mypage-header">
      <div className="mypage-container">
        <div className="left-group">
          <section className="profile-group section-card">
            <div className="profile-section">
              {userInfo.profileImageUrl ? (
                <img src={userInfo.profileImageUrl} alt="프로필 이미지" className="profile-image" />
              ) : (
                <i className="bi bi-person-circle profile-icon" aria-label="기본 프로필 아이콘"></i>
              )}
              <h2>{userInfo.nickname}님</h2>
              <button className="toggle-profile-controls-btn" onClick={() => setProfileControlsOpen(!isProfileControlsOpen)}>
                {isProfileControlsOpen ? '프로필 설정 닫기 ▲' : '프로필 설정 열기 ▼'}
              </button>
              {isProfileControlsOpen && (
                <div className="profile-buttons d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-default"
                    style={{ backgroundColor: '#0099ff', color: '#fff' }}
                    onClick={handleImageDelete}
                  >
                    프로필 삭제
                  </button>
                  <label className="btn btn-primary mb-0" htmlFor="profileImageUpload">
                    이미지 업로드
                  </label>
                  <input
                    id="profileImageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="d-none upload-image-input"
                  />
                </div>
              )}
            </div>
          </section>

          <section className="info-group section-card">
            <h3>내 정보</h3>
            <div className="info-field"><label>ID</label><span>{userInfo.nickname}</span></div>
            <div className="info-field"><label>PW</label><span>••••••••</span></div>
            <div className="info-field"><label>전화번호</label><span>{userInfo.phoneNumber}</span></div>
            <div className="info-field"><label>Email</label><span>{userInfo.email}</span></div>
          </section>
        </div>

                
        <div className="activity-group-container">
          <div className="activity-graph-container mt-4">
            <h4 className="mb-3">📈 활동 주기</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="posts" stroke="#007bff" name="게시글 수" />
                <Line type="monotone" dataKey="comments" stroke="#28a745" name="댓글 수" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="activity-group">
            {['posts', 'comments', 'likedPosts', 'likedComments'].map((key) => {
              const labelMap = {
                posts: '내가 작성한 게시글',
                comments: '내가 작성한 댓글',
                likedPosts: '좋아요 누른 게시글',
                likedComments: '좋아요 누른 댓글'
              };
              const items = eval(key);
              const isPost = key === 'posts';
              const isComment = key === 'comments';
              return (
                <section className={`section-card ${openSections[key] ? 'open' : ''}`} key={key}>
                  <h5 onClick={() => toggleSection(key)}>
                    <span>{labelMap[key]}</span>
                    <button className="toggle-btn">{openSections[key] ? '▲' : '▼'}</button>
                  </h5>
                  <ul>
                    {items.length > 0 ? (
                      items.map((item) => (
                        <li key={item.postId || item.commentId}>
                          <span onClick={() => (window.location.href = `/posts/${item.postId}`)}>
                            {item.title || item.content}
                          </span>
                          <span>좋아요 {item.likes}</span>
                          {isPost && <button onClick={() => handleDeletePost(item.postId)}>삭제</button>}
                          {isComment && <button onClick={() => handleDeleteComment(item.commentId)}>삭제</button>}
                        </li>
                      ))
                    ) : (
                      <li className="empty-message">{labelMap[key]}이 없습니다.</li>
                    )}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
