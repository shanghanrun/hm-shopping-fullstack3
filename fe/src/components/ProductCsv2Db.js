import React from 'react';
import {Button} from 'react-bootstrap'
import api from '../utils/api';
import uiStore from '../store/uiStore'

const ProductCsv2Db = () => {
	const {showToastMessage} = uiStore()

  const handleImport = async () => {
    try {
      const response = await api.get('/products-csv-to-localDb');
	  showToastMessage(response.data, "success"); 
      console.log(response.data); // 응답 메시지를 콘솔에 출력
      alert(response.data); // 사용자에게 알림 표시
    } catch (error) {
      console.error('Error CSV to DB:', error);
      alert('Error CSV to DB.');
	  showToastMessage('Error exporting CSV.', "error");
    }
  };

  return (
    <div>
      <Button onClick={handleImport}>ProductCSV to LocalDB</Button>
    </div>
  );
};

export default ProductCsv2Db;
