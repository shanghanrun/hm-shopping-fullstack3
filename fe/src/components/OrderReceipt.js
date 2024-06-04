import React, {useState, useEffect} from "react";
import { Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { currencyFormat } from "../utils/number";
import cartStore from '../store/cartStore'
import uiStore from '../store/uiStore'
import orderStore from '../store/orderStore'
import userStore from '../store/userStore'

const OrderReceipt = ({items, user}) => {
  const {setLeftCred, setLeftCoup, setLTotal, setCredPlus} =userStore()
  console.log('user, credit, coupon :', user, ':', user?.credit, ':', user?.coupon)
  const {showToastMessage} = uiStore()
  const {getCart} = cartStore()

  const location = useLocation();
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [lastTotal, setLastTotal] = useState(0)
  const [subTotal, setSubTotal] = useState(0)
  const [leftCredit, setLeftCredit] = useState(user?.credit)
  const [leftCoupon, setLeftCoupon] = useState(user?.coupon)
  const [rightCredit, setRightCredit] = useState(0)
  const [rightCoupon, setRightCoupon] = useState(0)
  const [couponUsed, setCouponUsed] = useState(false)//중복클릭방지용
  const [creditUsed, setCreditUsed] = useState(false)

  const {setTotalPrice} = orderStore()
  
  function useAllCredit(){
    console.log('lastTotal:', lastTotal)
    console.log('subTotal:', subTotal)
    if (lastTotal === 0 || subTotal ===0) return // lastTotal이 0이 된 상황에서는 계산 안한다.
    if (leftCredit === 0) return
    if(!creditUsed){
      if((subTotal-leftCredit)>0){
        setLastTotal(subTotal - leftCredit) //변하기전 leftCredit값
        setSubTotal(subTotal- leftCredit)
        setRightCredit(leftCredit); setLeftCredit(0); 
      } else{
        const diff = leftCredit -subTotal;
        setLastTotal(0)
        setLeftCredit(diff);
        setRightCredit(leftCredit-diff)
      }
      setCreditUsed(true)
    }
  }
  function useAllCoupon(){
    console.log('lastTotal:', lastTotal)
    console.log('subTotal:', subTotal)
    if(lastTotal === 0 || subTotal ===0) return
    if (leftCoupon === 0) return
    if(!couponUsed){
      if(subTotal-leftCoupon >0){
        setLastTotal(subTotal - leftCoupon)
        setSubTotal(subTotal- leftCoupon)
        setRightCoupon(leftCoupon); setLeftCoupon(0); 
      } else{
        const diff = leftCoupon -subTotal;
        setLastTotal(0)
        setLeftCoupon(diff);
        setRightCoupon(leftCoupon-diff)
      }
      setCouponUsed(true)
    }
  }
  
  useEffect(()=>{
    // if(!items){
    //   return(<div>None</div>)
    // }
    const newTotal = items.reduce((sum, item) => sum + (item.productId.price * item.qty), 0);
    setTotal(newTotal); setSubTotal(newTotal)
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
            <span>coupon: {leftCoupon} </span><Badge onClick={useAllCoupon}>모두사용</Badge> => <span>{rightCoupon}</span>
          </div>
          <div>{total} - {rightCredit} -{rightCoupon} ={currencyFormat(lastTotal)}</div>
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
              //user정보변경
              setLeftCoup(leftCoupon); setLeftCred(leftCredit);
              setLTotal(lastTotal)
              setCredPlus(lastTotal*0.05)
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
