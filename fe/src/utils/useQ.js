import {useNavigate} from 'react-router-dom'

const useQ =(searchQuery)=>{
	const navigate = useNavigate()
	
	 // 원본 searchQuery 객체를 복사하여 sanitizedQuery에 저장
  const sanitizedQuery = { ...searchQuery };  //불필요한 필드를 제거한 '정화된 쿼리'
	
	if(sanitizedQuery.name ===''){
		delete sanitizedQuery.name;
	}
	if(sanitizedQuery.orderNum ===''){
		delete sanitizedQuery.orderNum;
	}
	if(sanitizedQuery.page ===''){
		delete sanitizedQuery.page;
	}
	const searchParamsString = new URLSearchParams(sanitizedQuery).toString();
  navigate("?" + searchParamsString )
}

export default useQ;