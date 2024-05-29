import React from "react";
import ProductCard2 from "./ProductCard2";
import Button from 'react-bootstrap/Button';

const Popup = ({showPopup, closePopup, newProductList}) => {

  if(!showPopup || !newProductList) return <div></div>
  return (
    <div className='popup'>
      <h5 style={{margin:'10px 10px'}}>새로운 신상품 : {newProductList?.length}</h5>
      <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
        {newProductList?.map((item, i)=>
          <div key={i} >
            <ProductCard2 item={item} />
          </div>
        )}
      </div>
        <Button style={{marginLeft:'10px',marginBottom:'10px'}} onClick={()=>
          closePopup()}>닫기</Button>
    </div>
  );
};

export default Popup;
