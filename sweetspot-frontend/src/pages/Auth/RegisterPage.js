import React, { useState } from 'react';
import axios from '../../api/axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/effect-creative';
import './LoginPage.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
    phoneNumber: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      const userJson = JSON.stringify(formData);
      form.append('user', new Blob([userJson], { type: 'application/json' }));

      const response = await axios.post('/register', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('회원가입 성공!');
      navigate('/signin'); // 회원가입 후 로그인 페이지로 이동
      console.log(response.data);
    } catch (error) {
      setMessage(
        typeof error.response?.data === 'string'
          ? error.response.data
          : JSON.stringify(error.response?.data) || '회원가입 실패'
      );
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center h-75" style={{ backgroundColor: '#f9f9f9' }}>
      <div className="login-container row shadow rounded overflow-hidden" style={{ width: '80%', maxWidth: '1100px', height: '85vh' }}>
        
        {/* 왼쪽 Swiper 배너 */}
        <div className="col-md-6 p-0 h-100">
          <Swiper
            effect={'creative'}
            grabCursor={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            creativeEffect={{
              prev: { shadow: true, translate: [0, 0, -200] },
              next: { translate: ['100%', 0, 0] },
            }}
            modules={[EffectCreative, Autoplay]}
            className="h-100 w-100"
          >
            <SwiperSlide>
              <img src="/images/loginBanner/banner1.jpg" className="w-100 h-100 object-fit-cover" alt="배너1" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/loginBanner/banner2.jpg" className="w-100 h-100 object-fit-cover" alt="배너2" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/loginBanner/banner3.jpg" className="w-100 h-100 object-fit-cover" alt="배너3" />
            </SwiperSlide>
          </Swiper>
        </div>

        {/* 오른쪽 폼 */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light ">
          <form className="login-form text-center" onSubmit={handleRegister}>
            <h2 className="mb-4">회원가입</h2>
            <label className="mb-4">SweetSpot에 가입하고 다양한 기능을 사용해 보세요!</label>
            <input name="email" type="email" placeholder="이메일" className="form-control mb-3" value={formData.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="비밀번호" className="form-control mb-3" value={formData.password} onChange={handleChange} required />
            <input name="nickname" placeholder="닉네임" className="form-control mb-3" value={formData.nickname} onChange={handleChange} required />
            <input name="phoneNumber" placeholder="전화번호" className="form-control mb-3" value={formData.phoneNumber} onChange={handleChange} required />
            <button type="submit" className="btn btn-primary w-100">가입하기</button>
            {message && <p className="mt-3 text-danger">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

