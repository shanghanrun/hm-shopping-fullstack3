import React from "react";
import ClothesCard from "../components/ClothesCard";
import { Row, Col, Container } from "react-bootstrap";
import productStore from '../store/productStore';

const Clothes =()=>{
const {clothesList}= productStore()
 
  return (
    <Container>
      <Row>
        {clothesList?.map((clothes,i) =>(
          <Col md={3} sm={12} key={i}>
            <ClothesCard item={clothes}/>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Clothes;