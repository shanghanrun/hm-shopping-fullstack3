import {create} from 'zustand'
import api2 from '../utils/api2';

export const movieStore = create((set, get)=>({
	title:'',
	image:'',
	seat:[],
	user:{},
	userMovies:[],
	getUserMovies:async(userId)=>{
		try{
			const resp = await api2.post('/movie/get-movies', {userId})
			set({userMovies: resp.data.data})
			console.log('스토어로 받은 영화정보:', resp.data.data)
		}catch(e){
			console.log(e.error)
		}
	},
}))

export default movieStore;