// src/components/UpButton.jsx
import React, { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa'; // FontAwesome 아이콘 사용
import './UpButton.css'; // 스타일 파일


export default function UpButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    isVisible && (
      <button className="up-button" onClick={scrollToTop}>
        <FaArrowUp />
      </button>
    )
  );
}
