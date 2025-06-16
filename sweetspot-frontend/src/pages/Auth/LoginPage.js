import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

// Swiper 관련 import
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-creative';

import './LoginPage.css';

const LoginPage = ({ setIsLoggedIn, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        '/login',
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      const userData = response.data;
      // 서버가 로그인 성공 시 유저 전체 정보를 반환한다고 가정
      console.log('로그인 성공:', response.data);

      // 로그인 성공 메시지 출력
      setMessage(`환영합니다, ${response.data.nickname}님`);

      // 로그인 상태와 사용자 정보 상태 업데이트
      setIsLoggedIn(true);
      // LoginPage.js
setUser(userData);
localStorage.setItem('user', JSON.stringify(userData));
localStorage.getItem('userId')
localStorage.setItem('userId', response.data.userId);


console.log('로그인 후 user:', response.data);

      // 메인 페이지 혹은 원하는 페이지로 이동
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage('이메일 또는 비밀번호가 잘못되었습니다.');
      } else {
        setMessage('로그인 중 오류가 발생했습니다.');
        console.error(error);
      }
    }
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: '#f9f9f9' }}
    >
      <div
        className="login-container row shadow rounded overflow-hidden"
        style={{ width: '80%', maxWidth: '1100px', height: '85vh' }}
      >
        <div className="col-md-6 p-0 h-100">
          <Swiper
            effect={'creative'}
            grabCursor={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            creativeEffect={{
              prev: {
                shadow: true,
                translate: [0, 0, -200],
              },
              next: {
                translate: ['100%', 0, 0],
              },
            }}
            modules={[EffectCreative, Autoplay]}
            className="h-100 w-100"
          >
            <SwiperSlide>
              <img
                src="/images/loginBanner/banner1.jpg"
                className="w-100 h-100 object-fit-cover"
                alt="배너1"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/images/loginBanner/banner2.jpg"
                className="w-100 h-100 object-fit-cover"
                alt="배너2"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/images/loginBanner/banner3.jpg"
                className="w-100 h-100 object-fit-cover"
                alt="배너3"
              />
            </SwiperSlide>
          </Swiper>
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
          <form className="login-form text-center w-75" onSubmit={handleLogin}>
            <h2 className="mb-4">로그인</h2>
            <label className="mb-2">이메일과 비밀번호로 로그인하세요</label>
            <input
              type="email"
              placeholder="이메일"
              className="form-control mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              className="form-control mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary w-100">
              로그인
            </button>
            {message && <p className="mt-3 text-danger">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
