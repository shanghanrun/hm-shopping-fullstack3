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
		console.log('클로스 스토어 프러덕트리스트:', productStore.getState().productList);
		const list = productStore.getState().productList.filter((item)=> item.category.some(cat => CLOTHES_CATEGORY.includes(cat))
		);
		console.log('클로스 스토어 list!!!', list)
		set({
			clothesList: list,
			clothesUpdated: !get().clothesUpdated
		})
	},

	
}))

export default clothesStore;