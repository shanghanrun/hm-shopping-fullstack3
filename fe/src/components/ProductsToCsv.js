import React, { useState } from 'react';
import api from '../utils/api';
import {Button} from 'react-bootstrap'
import uiStore from '../store/uiStore'

//몽고디비의 products 컬렉션 자료를 백앤드에 csv로 저장
const ProductsToCsv = () => {
	const {showToastMessage} = uiStore()
	
  const downloadCSV = async () => {
    try {
      const response = await api.get('/export-products-csv');
      showToastMessage(response.data, "success"); // 응답 메시지를 상태로 저장
    } catch (error) {
      console.error('Error downloading CSV file:', error);
      showToastMessage('Error exporting CSV.', "error");
    }
  };

  return (
    <div style={{marginBottom: '10px'}}>
      <Button variant="success"
        onClick={downloadCSV}>Download CSV</Button>
    </div> 
  );
};

export default ProductsToCsv;
