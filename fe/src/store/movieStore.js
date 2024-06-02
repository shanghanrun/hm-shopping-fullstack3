import {create} from 'zustand'

const movieStore = create((set, get)=>({
	movie:{},
	setMovie:(val)=>set({movie: val})
}))

export default movieStore;