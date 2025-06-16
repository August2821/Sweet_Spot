import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import './Header.css';

function Header({ isLoggedIn, setIsLoggedIn, setUser }) {

const handleLogout = () => {
  localStorage.removeItem('user');  // userId → user 로 수정
  setUser(null);
  setIsLoggedIn(false);             // 이거 꼭 필요함
  window.location.href = "/";       // 또는 navigate("/") 사용 가능
};
  return (
    <Navbar variant="light" expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand href="/" className="navbar-brand">SweetSpot</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn && (
              <Nav.Link href="/mymap" className="custom-link">나만의 꿀장소</Nav.Link>
            )}
            {/* <Nav.Link href="/map" className="custom-link">꿀장소</Nav.Link> */}
            <Nav.Link href="/mapcommunity" className="custom-link">꿀게시판</Nav.Link>
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <>
                <Button href="/MyPage" variant="custom" className="btn">마이페이지</Button>
                <Button onClick={handleLogout} variant="custom" className="btn">로그아웃</Button>
              </>
            ) : (
              <>
                <Button href="/signup" variant="custom" className="btn">가입하기</Button>
                <Button href="/signin" variant="custom" className="btn">로그인</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
