import { useEffect } from 'react';
import userStore from '../store/userStore'
// import { useNavigate } from 'react-router-dom';

const Movies =()=>{
	// const navigate = useNavigate();
	const {user} = userStore()

	let url
	useEffect(()=>{
		if(user){

			// navigate(['/movies', 'https://eloquent-pastelito-120fb6.netlify.app'], { queryParams: { user: JSON.stringify(user) } });


			let userInfo = JSON.stringify(user)
			// navigate(`https://eloquent-pastelito-120fb6.netlify.app?user=${encodeURIComponent(userInfo)}`);


			// let userInfo =user
			// userInfo = userInfo.JSON.stringify()
			url = `https://eloquent-pastelito-120fb6.netlify.app?user=${userInfo}`;
			window.location.href = url;
		} else{
			url ='https://eloquent-pastelito-120fb6.netlify.app'
			//  navigate('https://eloquent-pastelito-120fb6.netlify.app');
			window.location.href = url;
		}
		// const token = sessionStorage.getItem('token'); // 예: 로컬 스토리지 또는 세션 스토리지에서 가져옴
		// const url = `https://eloquent-pastelito-120fb6.netlify.app?token=${token}`;
		// window.location.href = url;

		// window.location.href = 'https://eloquent-pastelito-120fb6.netlify.app';
		// const movie = axios.get('https://eloquent-pastelito-120fb6.netlify.app')
	},[])
	return(
		<h2>Movies Page로 이동중 ...</h2>
	)
}

export default Movies;