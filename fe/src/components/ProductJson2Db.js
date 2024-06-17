import React from 'react';
import {Button} from 'react-bootstrap'
import api from '../utils/api';
import uiStore from '../store/uiStore'

const ProductJson2Db = () => {
	const {showToastMessage} = uiStore()

  const handleImport = async () => {
    try {
      const response = await api.get('/products-json-to-localDb');
	  showToastMessage(response.data, "success"); 
      console.log(response.data); // 응답 메시지를 콘솔에 출력
      alert(response.data); // 사용자에게 알림 표시
    } catch (error) {
      console.error('Error json to DB:', error);
      alert('Error Json to DB.');
	  showToastMessage('Error exporting json.', "error");
    }
  };

  return (
    <div>
      <Button onClick={handleImport}>ProductJson to LocalDB</Button>
    </div>
  );
};

export default ProductJson2Db;
