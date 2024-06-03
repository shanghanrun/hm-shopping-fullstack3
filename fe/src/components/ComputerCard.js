import React from "react";
import { useNavigate } from 'react-router-dom';
import { currencyFormat } from "../utils/number";
import productStore from '../store/productStore'

const ComputerCard = ({item}) => {
  const {selectComputer} = productStore()
	const navigate = useNavigate()

  const showComputerDetail = (id) => {
    selectComputer(id)
    navigate(`/computer/${id}`)
  };
  
  return (
    <div className="card" onClick={()=>showComputerDetail(item?._id)}>
      <img
        src={item?.image} alt="" />
      <div>{item?.name}</div>
      <div>W {currencyFormat(item?.price)}</div>
    </div>
  );
};

export default ComputerCard;
