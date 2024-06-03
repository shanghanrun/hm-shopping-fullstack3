import React from "react";
import { useNavigate } from 'react-router-dom';
import { currencyFormat } from "../utils/number";
import productStore from '../store/productStore'

const ProductCard = ({item}) => {
  const {selectProduct} = productStore()
  // console.log('items 배열안 각 객체의 _id', item?._id)
	const navigate = useNavigate()

  const showProductDetail = (id) => {
    selectProduct(id)
    navigate(`product/${id}`)
  };
  
  return (
    <div className="card" onClick={()=>showProductDetail(item?._id)}>
      <img
        src={item?.image} alt="" />
      <div>{item?.name}</div>
      <div>W {currencyFormat(item?.price)}</div>
    </div>
  );
};

export default ProductCard;
