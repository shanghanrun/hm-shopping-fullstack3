import {create} from 'zustand'
import api2 from '../utils/api2';

export const movieStore = create((set, get)=>({
	// movieList: [],
	// index:-1,
	title:'',
	image:'',
	seat:[],
	user:{},
	userMovies:[],
	// createUserMovie:async(userId, title,seat,image)=>{
	// 	try{
	// 		const resp = await api2.post('/movie',{userId,title,seat,image})
	// 		console.log('생성한 유저영화:',resp.data.data)
	// 	}catch(e){
	// 		console.log(e.error)
	// 	}
	// },
	getUserMovies:async(userId)=>{
		try{
			const resp = await api2.post('/movie/get-movies', {userId})
			set({userMovies: resp.data.data})
			console.log('스토어로 받은 영화정보:', resp.data.data)
		}catch(e){
			console.log(e.error)
		}
	},
	// setUser:(val)=>set({user: val}),
	// setMovieList: (val)=>
	// 	set((state)=> ({
	// 		movieList: [...state.movieList, ...val]})),
	// setIndex:(val) =>set((state)=>({index: val})),
	// setTitle:(val) =>set((state)=>({title: val})),
	// setImage:(val) =>{
	// 	set((state)=>({image: val}))
	// },
	// setSeat:(val)=>set((state)=>({seat: val}))
}))

export default movieStore;