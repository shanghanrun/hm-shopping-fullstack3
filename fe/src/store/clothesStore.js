import {create} from 'zustand'
import api from '../utils/api';
import uiStore from './uiStore'
import productStore from './productStore'

const CLOTHES_CATEGORY =[
	"Top", "Dress", "Pants", "Skirt","Shorts","Hat",
	"Shirt",
]


const clothesStore =create((set,get)=>({
	clothesUpdated:false,
	selectedClothes:null,
	clothesList:[],
	totalPage:1,
	// totalProductCount:1,

	getClothesList:()=>{
		const list = productStore.getState().productList.filter((item)=> CLOTHES_CATEGORY.includes(item.category))
		console.log('list!!!', list)
		set({
			clothesList: list,
			clothesUpdated: !get().clothesUpdated
		})
	},

	
}))

export default clothesStore;