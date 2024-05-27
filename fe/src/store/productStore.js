import {create} from 'zustand'
import api from '../utils/api';
import uiStore from './uiStore'
import { isEqual } from 'lodash';

// const {showToastMessage} =uiStore() 이러면 useRef()에러 난다.

const productStore =create((set,get)=>({
	error:'',
	productUpdated:false,
	selectedProduct:null,
	productList:[],
	initialProductList:[],
	totalPage:1,
	totalProductCount:1,
	newProductList:[], // 신상 공개용 리스트 
	emptyNewProductList:()=>set({newProductList:[]}), 
	setProducts:(results)=>{
		set((state)=>({
			productList: results,
			productUpdated: !state.productUpdated
		}))
	},
	getProductList:async(searchQuery)=>{
		if(searchQuery?.name === ''){
			delete searchQuery.name;
		}
		try{
			const resp= await api.get('/product', {params: {...searchQuery}})
			if(resp.status !==200) throw new Error(resp.error)
			console.log('product목록:',resp.data.data)
			console.log('page 정보 : ',resp.data.totalPageNum)
			set({
				totalPage: resp.data.totalPageNum,
				totalProductCount: resp.data.totalProductCount,
			})
			const list = resp.data.data
			console.log('list :', list)

			set({
				productList: [...list],    	initialProductList:[...list]})	
		}catch(e){
			console.log('e.message:', e.message)
			set({error: e.message})
			// uiStore.getState().showToastMessage(e.message, 'error');
			// payment페이지처럼 페이지네이션 안된 곳에서 에러메시지 안나오도록
		}
	},
	selectProduct:(id)=>{
		const selectedOne = get().productList.find((item)=> item._id === id)
		set({selectedProduct: selectedOne})
	},
	createProduct:async(formData, navigate)=>{
		console.log('store로 받은 formData :', formData)
		try{
			const resp = await api.post('/product', formData)
			if(resp.status !==200) throw new Error(resp.error)
			console.log('성공한 데이터:', resp.data.data)
			uiStore.getState().showToastMessage('상품가입을 완료했습니다.', 'success');

			set((state)=>({
				productList: [...state.productList, resp.data.data],
				newProductList:[...state.newProductList, resp.data.data],
				productUpdated: !state.productUpdated
			}))
			navigate('/admin/product')
			//이렇게 productList를 업데이트하면, 새로만든 물폼이 화면에 반영된다.

		}catch(e){
			console.log('e.message:', e.message)
			set({error: e.message})
			uiStore.getState().showToastMessage(e.message, 'error');
		}
	},
	batchCreateProducts:async(formData,navigate)=>{
		console.log('store로 받은 formData :', formData)
		try{
			const resp = await api.post('/product/batch', formData)
			if(resp.status !==200) throw new Error(resp.error)
			console.log('성공한 데이터:', resp.data.data)
			uiStore.getState().showToastMessage('상품 일괄가입을 완료했습니다.', 'success');

			set((state)=>({
				productList: [...state.productList, ...resp.data.data],
				newProductList:[...state.newProductList, ...resp.data.data],
				productUpdated: !state.productUpdated
			}))
			navigate('/admin/product')
			//이렇게 productList를 업데이트하면, 새로만든 물폼이 화면에 반영된다.

		}catch(e){
			console.log('e.message:', e.message)
			set({error: e.message})
			uiStore.getState().showToastMessage(e.message, 'error');
		}
	},
	setSelectedProduct:(product)=>{
		set((state)=>({
			selectedProduct: product,
			productUpdated: !state.productUpdated
		}))
	},

	editProduct:async(formData,navigate)=>{
		console.log('store로 받은 formData :', formData)
		try{
			const resp = await api.put('/product/'+formData._id, formData)
			if(resp.status !==200) throw new Error(resp.error)
			console.log('성공한 데이터:', resp.data.data)
			set((state)=>({
				selectedProduct: resp.data.data,
				productUpdated: !state.productUpdated
			}))
			uiStore.getState().showToastMessage('상품수정을 완료했습니다.', 'success');

			// set((state)=>({productList: [...state.productList, resp.data.data]})) 이건 안된다.
			//추가하면 뒤에 추가될 뿐이다.
			
			
			navigate('/admin/product')
			//이렇게 하면, 페이지가 열리면서 자연스럽게 새로운 productList를 받아오게 된다.

		}catch(e){
			console.log('e.message:', e.message)
			set({error: e.message})
			uiStore.getState().showToastMessage(e.message, 'error');
		}
	},
	deleteProduct:async(id,navigate)=>{
		console.log('store로 받은 id :', id)
		try{
			const resp = await api.delete('/product/'+id)
			if(resp.status !==200) throw new Error(resp.error)
			console.log('성공한 메시지:', resp.data.message)
			uiStore.getState().showToastMessage('상품이 삭제되었습니다.', 'success');		
			set((state)=>({
				productUpdated: !state.productUpdated
			}))		
			
			navigate('/admin/product')
			//이렇게 하면, 페이지가 열리면서 자연스럽게 새로운 productList를 받아오게 된다.

		}catch(e){
			console.log('e.message:', e.message)
			set({error: e.message})
			uiStore.getState().showToastMessage(e.message, 'error');
		}
	},
	getProduct:async(id)=>{
		console.log('store로 받은 id :', id)
		try{
			const resp = await api.get('/product/'+id)
			if(resp.status !==200) throw new Error(resp.error)
			console.log('성공한 데이터:', resp.data.data)
			set({selectedProduct: resp.data.data})
			// uiStore.getState().showToastMessage('상품 정보 획득.', 'success'); 과잉메시지라서 

			// navigate('/product/'+id) 현재페이지 url이 바뀔 필요없다.

		}catch(e){
			console.log('e.message:', e.message)
			set({error: e.message})
			uiStore.getState().showToastMessage(e.message, 'error');
		}
	}
}))

export default productStore;