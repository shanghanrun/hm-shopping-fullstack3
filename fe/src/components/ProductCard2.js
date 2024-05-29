import React from "react";
import { currencyFormat } from "../utils/number";

const ProductCard2 = ({item}) => {

  return (
    <div className="card2">
      <img
        src={item?.image} alt="" width='200px' height='200px'/>
      <div>{item?.name}</div>
      <div>W {currencyFormat(item?.price)}</div>
    </div>
  );
};

export default ProductCard2;
