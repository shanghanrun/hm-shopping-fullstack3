import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faBox,
  faSearch,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import userStore from '../store/userStore'
import productStore from '../store/productStore'
import cartStore from '../store/cartStore'
import movieStore from '../store/movieStore'
import {useSearchParams} from 'react-router-dom'
import PriceDropdown from "./PriceDropdown";
import CategoryDropdown from "./CategoryDropdown";
import SizeDropdown from "./SizeDropdown";

const Navbar = ({ user }) => {
  // console.log('user 정보:',user)
  // user를 찍어보니, 처음에는 null이다가 시간이 지나서 user값이 들어온다.
  let [width, setWidth] = useState(0);
  let navigate = useNavigate();
  const {getProductList} =productStore()
  const {cartCount, getCart} = cartStore()
  const {getUserMovies} = movieStore()
 
	const {logout} = userStore()
  const [searchQuery, setSearchQuery] =useState({
    page: '', name: ''}) //productAll 페이지는 페이지네이션 없이 모두 보이게
    //다른 곳은 page: 1을 디폴트로 해서 첫페이지만 보이게 한다.
    // page가 null이면 백엔드에서 모든 페이지정보를 보내게 만든다.
  const [keyword, setKeyword] = useState('')
  const isMobile = window.navigator.userAgent.indexOf("Mobile") !== -1;
  const [showSearchBox, setShowSearchBox] = useState(false);
  const menuList = [
    "All",
    "Clothes",
    "Computer",
    "Movies",
    "Info",
  ];
  

  const onCheckEnter = async (event) => {
    if (event.key === "Enter") {
      if(searchQuery.name ===''){
        delete searchQuery.name
      } 
      setSearchQuery({...searchQuery, name: keyword})
      //이렇게 새로운 객체를 만들어 넣어야 state값이 변화되고,
      // 아래 useEffect의 디펜던시리스트의 searchQuery가 의미가 있어 진다.
    }
    setKeyword('')
  };
  const getLogout = () => {
    navigate('/')
    logout()
  };

  // useEffect(()=>{ 아래로 병합
  //   //user값이 처음에 null이다가 늦게 들어온다.
  //   getUserMovies(user?._id)
  //   // 그래서 user.id하면 에러가 발생한다.
  //   // 그리고 초기에 user값이 없이 이것이 실행되니 값을 못받는다.
  //   console.log('navbar에서 영화정보 받아옴...')
  // },[user])

  useEffect(()=>{
    getProductList(searchQuery)
    if(user){
      getCart()
      getUserMovies(user?._id)
    }

    if(searchQuery.name === ''){
      delete searchQuery.name;
    }
    if(searchQuery.page ===''){
      delete searchQuery.page
    }
    const searchParamsString = new URLSearchParams(searchQuery).toString();
    navigate("?" + searchParamsString )
  },[searchQuery, cartCount, user])

  
  
  return (
    <div>
      {/* {showSearchBox && (
        <div className="display-space-between mobile-search-box w-100">
          <div className="search display-space-between w-100">
            <div style={{zIndex:'2'}}>
              <FontAwesomeIcon className="search-icon" icon={faSearch} />
              <input
                type="text"
                placeholder="제품검색"
                onKeyPress={onCheckEnter}
              />
            </div>
            <button
              className="closebtn"
              onClick={() => setShowSearchBox(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )} */}
      <div className="side-menu" style={{ width: width }}>
        <button className="closebtn" onClick={() => setWidth(0)}>
          &times;
        </button>

        <div className="side-menu-list" id="menu-list">
          {menuList.map((menu, index) => (
            <button key={index}>{menu}</button>
          ))}
        </div>
      </div>
      {user && user.level === "admin" && (
        <Link to="/admin/product?page=1" className="link-area">
          Admin page
        </Link>
      )}
      <div className="nav-header">
        <div className="burger-menu hide">
          <FontAwesomeIcon icon={faBars} onClick={() => setWidth(250)} />
        </div>

        <div>
          <div className="display-flex">
            <div style={{marginRight: '20px'}}>
              <CategoryDropdown />
            </div>
            <div style={{marginRight: '20px'}}>
              <SizeDropdown />
            </div>
            <div style={{marginRight: '20px'}}>
              <PriceDropdown />
            </div>
            {user ? (
              <div onClick={getLogout} className="nav-icon">
                <FontAwesomeIcon icon={faUser} />
                {!isMobile && (
                  <span style={{ cursor: "pointer" }}>로그아웃</span>
                )}
              </div>
            ) : (
              <div onClick={() => navigate("/login")} className="nav-icon">
                <FontAwesomeIcon icon={faUser} />
                {!isMobile && <span style={{ cursor: "pointer" }}>로그인</span>}
              </div>
            )}
            <div onClick={() => navigate("/cart")} className="nav-icon">
              <FontAwesomeIcon icon={faShoppingBag} />
              {!isMobile && (
                <span style={{ cursor: "pointer" }}>{`쇼핑백(${
                   cartCount || 0
                })`}</span>
              )}
            </div>
            <div
              onClick={() => navigate("/account/purchase")}
              className="nav-icon"
            >
              <FontAwesomeIcon icon={faBox} />
              {!isMobile && <span style={{ cursor: "pointer" }}>내 주문</span>}
            </div>
            {isMobile && (
              <div className="nav-icon" onClick={() => setShowSearchBox(true)}>
                <FontAwesomeIcon icon={faSearch} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="nav-logo" onClick={()=>getProductList()}>
        <Link to="/">
          <img width={100} src="/image/hm-logo.png" alt="hm-logo.png" />
        </Link>
      </div>
      <div className="nav-menu-area">
        <ul className="menu">
          {menuList.map((menu, index) => (
            <li key={index}className="menu-item">
              <Link to={`/${menu.toLowerCase()}`}>{(menu==='Computer')? 'Computer/가전/자동차' : menu}</Link>
            </li>
          ))}
        </ul>
        {!isMobile && ( // admin페이지에서 같은 search-box스타일을 쓰고있음 그래서 여기서 서치박스 안보이는것 처리를 해줌
          <div className="search-box landing-search-box ">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="제품검색"
              onKeyDown={onCheckEnter}
              onChange={(e)=>{console.log(e.target.value); setKeyword(e.target.value)}}
              value={keyword}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
