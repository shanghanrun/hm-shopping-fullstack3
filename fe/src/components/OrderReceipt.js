import React, {useState, useEffect} from "react";
import { Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { currencyFormat } from "../utils/number";
import cartStore from '../store/cartStore'
import uiStore from '../store/uiStore'
import orderStore from '../store/orderStore'
import userStore from '../store/userStore'

const OrderReceipt = ({items}) => {
  const {credit, coupon, setCredit, setCoupon, setUserCreditCoupon} =userStore()
  const {showToastMessage} = uiStore()
  const {getCart} = cartStore()

  const location = useLocation();
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [lastTotal, setLastTotal] = useState(0)
  const [leftCredit, setLeftCredit] = useState(credit)
  const [leftCoupon, setLeftCoupon] = useState(coupon)
  const [rightCredit, setRightCredit] = useState(0)
  const [rightCoupon, setRightCoupon] = useState(0)

  const {setTotalPrice} = orderStore()
  
  function useAllCredit(){
    if((total-leftCredit)>0){
      setLastTotal(total - leftCredit) //변하기전 leftCredit값
      setRightCredit(leftCredit); setLeftCredit(0); 
    } else{
      const diff = leftCredit -total;
      setLastTotal(0)
      setLeftCredit(leftCredit-diff);
      setRightCredit(diff)
    }
  }
  function useAllCoupon(){
    if((total-leftCoupon)>0){
      setLastTotal(total - leftCoupon)
      setRightCoupon(leftCoupon); setLeftCoupon(0); 
    } else{
      const diff = leftCoupon -total;
      setLastTotal(0)
      setLeftCoupon(leftCoupon-diff);
      setRightCoupon(diff)
    }
  }
  
  useEffect(()=>{
    // if(!items){
    //   return(<div>None</div>)
    // }
    const newTotal = items.reduce((sum, item) => sum + (item.productId.price * item.qty), 0);
    setTotal(newTotal);
    setLastTotal(newTotal);
    setTotalPrice(newTotal)
  },[items])

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
      <div className="display-flex space-between receipt-title">
        <div>
          <strong>Total:</strong>
        </div>
        <div>
          <strong>₩ {currencyFormat(total)}</strong>
          <div>
            <span>credit: {leftCredit} </span><Badge onClick={useAllCredit}>모두사용</Badge> => <span>{rightCredit}</span>
          </div>
          <div>
            <span>coupon: {leftCredit} </span><Badge onClick={useAllCoupon}>모두사용</Badge> => <span>{rightCredit}</span>
          </div>
          <div>{total} - {rightCredit} -{rightCoupon} ={lastTotal}</div>
          <div>총 결제금액 {lastTotal}의 5% 인 {lastTotal *0.05}원이 credit으로 적립됩니다.</div>
        </div>
      </div>
      {location.pathname.includes("/cart") && (
        <Button
          variant="dark"
          className="payment-button"
          onClick={async() => {
            if(items.length===0){
              showToastMessage('결제할 아이템이 없습니다. 첫페이지로 이동합니다.', 'error')
              setTimeout(() => {
                navigate('/')
              }, 3000);
            } else{
              //user정보변경(스토어:쿠폰,크래딧, 디비: 쿠폰,크래딧,크래딧적립)
              //스토어
              setCoupon(leftCoupon); setCredit(leftCredit)
              //디비
              await setUserCreditCoupon(leftCredit, leftCoupon,lastTotal *0.05)
              await getCart() //미리 카트정보도 갱신(혹시 갈 수 있으니)
              navigate("/payment")}
            }}
        >
          결제 계속하기
        </Button>
      )}

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

export default OrderReceipt;
