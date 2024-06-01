import React, { useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import productStore from '../store/productStore';
import clothesStore from '../store/clothesStore'
import orderStore from '../store/orderStore'
import userStore from '../store/userStore'
// import uiStore from '../store/uiStore'
import Popup from "../components/Popup";


const ProductAll = () => {
  const {productList,newProductList,showPopup, closePopup} = productStore()
  const {user} = userStore()
  // const {popupContent} = uiStore() 
  const {getOrderList} = orderStore()
  // productList를 구독하고 있으면 된다.

  useEffect(()=>{
    if(user) getOrderList()
  },[])
 
  return (
    <Container>
      <div className='popup-mother'>
        <Popup 
        showPopup={showPopup}
        closePopup={closePopup}
        newProductList={newProductList}
        />
      </div>
      <Row>
        {productList?.map((product,i) =>(
          <Col md={3} sm={12} key={i}>
            <ProductCard item={product}/>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductAll;
