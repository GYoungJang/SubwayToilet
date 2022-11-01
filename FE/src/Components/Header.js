import React, { useState, useEffect } from "react";

import { BiMenu } from "react-icons/bi";
import { BiArrowBack } from "react-icons/bi";
import axios from 'axios';
import styles from "./Header.module.scss";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const SERVER_URL = 'http://localhost:8000/user/login';
  const [login1, setlogin1] = useState(false);

  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if (token) {
      setlogin1(true);
    }
  }, [token]);

  const handleLogOut = () => {
    setlogin1(false);
    localStorage.removeItem('token');
  }

  const handlelogin = () => {
      if (login1 && login1.accessToken) {
        //return { Authorization: 'Bearer ' + login1.accessToken };
        return { "token": login1.accessToken };
      } else {
        setlogin1(true);
      } return {}
      
    };

  //if(true면 로그아웃 버튼 구현
  // flase면 로그인 버튼 보여주기)

  const menuToggleHandler = () => {
    setMenuOpen((p) => !p);
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__content}>
        <nav
          className={`${styles.header__content__nav} ${
            menuOpen ? styles.isMenu : ""
          }`}
        >
          <ul>
            <li>
              <Link to="/page-notice" onClick={menuToggleHandler}>
                공지사항
              </Link>
            </li>
            <li>
              <Link to="/page-suggest" onClick={menuToggleHandler}>
                건의사항/정보수정요청
              </Link>
            </li>
            <li>
              <Link to="/mypage" onClick={menuToggleHandler}>
                마이페이지
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.header__content__toggle}>
          {!menuOpen ? (
            <BiMenu onClick={menuToggleHandler} />
          ) : (
            <BiArrowBack onClick={menuToggleHandler} />
          )}
        </div>
        <Link to="/" className={styles.header__content__logo}>
          Logo
        </Link>
        <Link to="/login">
          <button className={styles.header__content__button} onChange={()=>handlelogin}>로그인</button>
          {/* { )) : {<button className={styles.header__content__button} onChange={()=>handleLogOut}>로그아웃</button>} } */}
        </Link>
      </div>
    </header>
  );
};

export default Header;
