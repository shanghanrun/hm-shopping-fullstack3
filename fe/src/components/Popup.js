import React from "react";
import ProductCard2 from "./ProductCard2";
import Button from 'react-bootstrap/Button';

const Popup = ({showPopup, closePopup, newProductList}) => {

  if(!showPopup || !newProductList) return <div></div>
  return (
    <div className='popup'>
      <h5>새로운 신상품 : {newProductList?.length}</h5>
        {newProductList?.map((item, i)=>
          <div key={i}>
            <ProductCard2 item={item} />
          </div>
        )}
        <Button onclick={()=>closePopup()}>닫기</Button>
    </div>
  );
};

export default Popup;
