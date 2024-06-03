import React from "react";
import { useNavigate } from 'react-router-dom';
import { currencyFormat } from "../utils/number";
import productStore from '../store/productStore'

const ClothesCard = ({item}) => {
  const {selectClothes} = productStore()
	const navigate = useNavigate()

  const showClothesDetail = (id) => {
    selectClothes(id)
    navigate(`/clothes/${id}`)
  };
  
  return (
    <div className="card" onClick={()=>showClothesDetail(item?._id)}>
      <img
        src={item?.image} alt="" />
      <div>{item?.name}</div>
      <div>W {currencyFormat(item?.price)}</div>
    </div>
  );
};

export default ClothesCard;
