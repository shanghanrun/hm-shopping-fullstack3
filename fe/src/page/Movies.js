import { useEffect } from 'react';
import userStore from '../store/userStore'
// import { useNavigate } from 'react-router-dom';

const Movies =()=>{
	// const navigate = useNavigate();
	const {user} = userStore()

	let url
	useEffect(()=>{
		if(user){
			let userInfo = JSON.stringify(user)
			url = `https://gleeful-halva-28c7ac.netlify.app?user=${userInfo}`;
			window.location.href = url;
		} else{
			url ='https://gleeful-halva-28c7ac.netlify.app'
			window.location.href = url;
		}
	},[])
	return(
		<h2>Movies Page로 이동중 ...</h2>
	)
}

export default Movies;