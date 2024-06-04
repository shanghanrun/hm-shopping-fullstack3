import React, {useState, useEffect} from "react";
import { Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { currencyFormat } from "../utils/number";
import cartStore from '../store/cartStore'
import uiStore from '../store/uiStore'
import orderStore from '../store/orderStore'
import userStore from '../store/userStore'

const PaymentOrderReceipt = ({items, lastTotal}) => {
  console.log('last Total :', lastTotal)
  const {showToastMessage} = uiStore()

  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="receipt-container">
      <h3 className="receipt-title">주문 내역</h3>
      <ul className="receipt-list">
        <li>
          {items.map((item)=>(
            <div key={item._id} className="display-flex space-between">
              <div>{item.productId.name}</div>
              <div>₩ {currencyFormat(item.productId.price*item.qty)}</div>
            </div>
          ))}
        </li>
      </ul>
      <div className="receipt-title">
          <strong>Total: ₩ {currencyFormat(lastTotal)}</strong>
      </div>
      
      <strong>* 결제금액의 5%인 {lastTotal*0.05}원이 credit로 적립됩니다.</strong>
      <div>
        가능한 결제 수단 귀하가 결제 단계에 도달할 때까지 가격 및 배송료는
        확인되지 않습니다.
        <div>
          30일의 반품 가능 기간, 반품 수수료 및 미수취시 발생하는 추가 배송 요금
          읽어보기 반품 및 환불
        </div>
      </div>
    </div>
  );
};

export default PaymentOrderReceipt;
