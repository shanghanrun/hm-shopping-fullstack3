import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import PaymentForm from "../components/PaymentForm";
import "../style/paymentPage.style.css";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { cc_expires_format } from "../utils/number";
import orderStore from '../store/orderStore'
import uiStore from '../store/uiStore'
import cartStore from '../store/cartStore'
import userStore from '../store/userStore'
import PaymentOrderReceipt from "../components/PaymentOrderReceipt";

const PaymentPage = () => {
  const {user, leftCredit, leftCoupon, creditPlus, lastTotal, setCoupon, setCredit, setUserCreditCoupon} = userStore()
  const salePrice = lastTotal;
  
  const {setShip, setPayment,createOrder} = orderStore()
  const {cart} = cartStore()
  const {showToastMessage} = uiStore()
  const {totalPrice} = orderStore()

  const [cardValue, setCardValue] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });
  const navigate = useNavigate();
  const [firstLoading, setFirstLoading] = useState(true);
  const [shipInfo, setShipInfo] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    // city: "", address와 중복되어서 제거한다.
    zip: "",
  });

  useEffect(()=>{
    // daum Postcode API를 사용할 수 있는 지 확인
    if (typeof window.daum === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = () => console.log('Daum Postcode script loaded');
      document.head.appendChild(script);
    }
  },[])

  // 다음 주소 검색 API통합
  const execDaumPostcode =()=>{
    new window.daum.Postcode({
      oncomplete:function(data){
        setShipInfo({
          ...shipInfo,
          address:data.address,
          zip:data.zonecode,
        })
      }
    }).open();
  }
  
  //맨처음 페이지 로딩할때는 넘어가고  오더번호를 받으면 성공페이지로 넘어가기

  const handleSubmit = async(event) => {
    event.preventDefault();
    if(!cart){
      showToastMessage('결제할 아이템이 없습니다. 첫페이지로 이동합니다.', 'error')
      setTimeout(() => {
        navigate('/')
      }, 3000);
    } else{
      //오더 생성하가ㅣ
      setShip(shipInfo)
      setPayment(cardValue)

      const {firstName,lastName,contact,address,city,zip} = shipInfo
      const {cvc, expiry,name,number} =cardValue

      // 기존의 order 생성방식을 주석처리하고, 몽고디비에서도 제거한다.
      // const data ={
      //   totalPrice, 
      //   shipTo:{address,city,zip},
      //   contact:{firstName,lastName,contact},
      //   items: cart.items.map((item)=>{
      //     return {
      //       productId: item.productId._id,
      //       price: item.productId.price,
      //       qty:item.qty,
      //       size: item.size
      //     }
      //   })
      // }

      // createOrder(data, navigate)
      
      // 잠시 주석처리한다. 에러상황에 대비해서
      const data ={
        totalPrice, 
        salePrice,
        shipTo:{address,city,zip},
        contact:{firstName,lastName,contact},
        items: cart.items.map((item)=>{
          return {
            productId: item.productId._id,
            sku: item.productId.sku,
            name: item.productId.name,
            image: item.productId.image,
            price: item.productId.price,
            qty:item.qty,
            size: item.size
          }
        })
      }
      //user정보변경(스토어:쿠폰,크래딧, 디비: 쿠폰,크래딧,크래딧적립)
      //스토어
      setCoupon(leftCoupon); setCredit(leftCredit)
      //디비
      await setUserCreditCoupon(user?._id, leftCredit, leftCoupon, creditPlus)
      await createOrder(data, navigate)
    }  
  };

  const handleFormChange = (event) => {
    //shipInfo에 값 넣어주기
    const {name,value} = event.target
    setShipInfo({...shipInfo, [name]: value})
  };

  const handlePaymentInfoChange = (event) => {
    //카드정보 넣어주기
    const {name,value} =event.target
    if(name === "expiry"){
      let newValue = cc_expires_format(value) 
      return setCardValue({...shipInfo, [name]: newValue})
    }
    setCardValue({...cardValue, [name]:value})
  };

  const handleInputFocus = (e) => {
    setCardValue({ ...cardValue, focus: e.target.name });
  };
  //카트에 아이템이 없다면 다시 카트페이지로 돌아가기 (결제할 아이템이 없으니 결제페이지로 가면 안됌)
  return (
    <Container>
      <Row>
        <Col lg={7}>
          <div>
            <h2 className="mb-2">배송 주소</h2>
            <div>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="lastName">
                    <Form.Label>성</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="lastName"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="firstName">
                    <Form.Label>이름</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="firstName"
                    />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label>연락처</Form.Label>
                  <Form.Control
                    placeholder="010-xxx-xxxxx"
                    onChange={handleFormChange}
                    required
                    name="contact"
                  />
                </Form.Group>

                <Button onClick={execDaumPostcode}>주소 검색</Button>
                <Form.Group as={Col} controlId="formGridZip">
                    <Form.Label>우편번호</Form.Label>
                    <Form.Control
                      placeholder=" 위의 '주소검색'을 이용해서 입력해주세요"
                      onChange={handleFormChange}
                      required
                      name="zip"
                      value={shipInfo.zip}
                    />
                  </Form.Group>
                <Form.Group className="mb-3" controlId="formGridAddress2">
                  <Form.Label>주소</Form.Label>
                  <Form.Control
                    placeholder="'주소 검색'으로 자동 완성됩니다."
                    onChange={handleFormChange}
                    required
                    name="address"
                    value={shipInfo.address}
                  />
                 
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGridAddress2">
                  <Form.Label>나머지 상세주소</Form.Label>
                  <Form.Control
                    placeholder="나머지 상세주소를 입력해 주세요"
                    onChange={handleFormChange}
                    required
                    name="address2"
                    value={shipInfo.address2}
                  />
                 
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>도시</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      placeholder="선택사항입니다. 입력하고 싶으면 입력해주세요"
                      name="city"
                      value={shipInfo.city}
                    />
                  </Form.Group>

                  
                </Row>
                {/* <div className="mobile-receipt-area"> 
                //아래로 이동했다. 그래야 우측에 나타나게 된다.
                  <OrderReceipt /> 
                </div> */}
                <div>
                  <h2 className="payment-title">결제 정보</h2>
                </div>
                {lastTotal?
                  <div>
                    <PaymentForm cardValue={cardValue}
                      handleInputFocus={handleInputFocus}
                      handlePaymentInfoChange={handlePaymentInfoChange}
                    />
                    <Button
                      variant="dark"
                      className="payment-button pay-button"
                      type="submit"
                    >
                      결제하기
                    </Button>
                  </div>
                  :
                  <div>
                    <h4>결제할 금액이 0원입니다.</h4>
                    <Button variant='success' onClick={handleSubmit}>주문하기</Button>
                  </div>
                }
              </Form>
            </div>
          </div>
        </Col>
        <Col lg={5} className="receipt-area">
          <PaymentOrderReceipt items={cart.items}
            lastTotal={lastTotal}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
