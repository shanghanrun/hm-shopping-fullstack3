import React, { useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import productStore from '../store/productStore';
import orderStore from '../store/orderStore'
import userStore from '../store/userStore'
// import uiStore from '../store/uiStore'
import Popup from "../components/Popup";

const Clothes =()=>{
const {clothesList}= productStore()
  //   const {user} = userStore()
//   const {getOrderList} = orderStore()
  // productList를 구독하고 있으면 된다.

 
  return (
    <Container>
      <Row>
        {clothesList?.map((clothes,i) =>(
          <Col md={3} sm={12} key={i}>
            <ProductCard item={clothes}/>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Clothes;