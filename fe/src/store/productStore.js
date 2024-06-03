import {create} from 'zustand'
import api from '../utils/api';
import uiStore from './uiStore'
// import { isEqual } from 'lodash';

const CLOTHES_CATEGORY = [
    "top", "dress", "pants", "skirt","shorts","hat",
    "shirt",
]; // 소문자로 해야 비교가 된다.
const COMPUTER_CATEGORY =[
	"computer", "tv", "냉장고","자동차","세탁기"
];
const productStore =create((set,get)=>({
	error:'',
	productUpdated:false,
	selectedProduct:null,
	selectedClothes:null,
	selectedComputer:null,
	productList:[],
	clothesList:[],
	computerList:[],
	initialProductList:[],
	totalPage:1,
	totalProductCount:1,
	newProductList:[], // 신상 공개용 리스트 
	showPopup: false, 
	openPopup:async()=>{
		// 한 페이지의 5개상품이 아니라 모든 상품리스트를 구해야 된다.
		await get().makeNewProductList()
		set({showPopup: true})
		console.log('신상정보보여주기용 list', get().newProductList)
		uiStore.getState().showToastMessage('신상홍보 팝업을 보냈습니다.', 'success')
	},
	closePopup:()=>{
		set({
			showPopup: false,
		});
	},
	emptyNewProductList:()=>set({
		newProductList:[],
		showPopup: false
	}), 
	makeNewProductList:async()=>{
		try{ // query params없이 보내면 모든 데이터 받는다.
			const days = 7;
			const resp = await api.get('/product') 
			const list = resp.data.data;
			console.log('신상 추출을 위한 모든 목록:', list)

			const today = new Date();
			const oneDayAgo = new Date(today);
			oneDayAgo.setDate(today.getDate()-days);

			set({
				newProductList: list.filter((item)=>{
					const itemDate = new Date(item.createdAt);
					return itemDate >= oneDayAgo && itemDate <=today;
				})
			})
		}catch(e){
			console.log(e.error)
		}	
	},
	setProducts:(results)=>{
		set((state)=>({
			productList: results,
			productUpdated: !state.productUpdated
		}))
	},
	sortProductListBySkuDesc: async()=>{
		const resp= await api.get('/product')
		const list = resp.data.data
		const sortedList = list.slice().sort((a, b) => {
			const skuA = parseInt(a.sku.replace('sku', ''), 10);
			const skuB = parseInt(b.sku.replace('sku', ''), 10);
			return skuB - skuA;
		});
		set({ productList: sortedList });
	},
	sortProductListBySkuAsc:()=>{
		const list = get().productList;
		const sortedList = list.slice().sort((a, b) => {
			const skuA = parseInt(a.sku.replace('sku', ''), 10);
			const skuB = parseInt(b.sku.replace('sku', ''), 10);
			return skuA - skuB;
		});
		set({ productList: sortedList });
	},

	getProductList:async(searchQuery)=>{
		if(searchQuery?.name === ''){
			delete searchQuery.name;
		}
		try{
			const resp= await api.get('/product', {params: {...searchQuery}})
			console.log('product목록:',resp.data.data)
			console.log('page 정보 : ',resp.data.totalPageNum)

			set({
				totalPage: resp.data.totalPageNum,
				totalProductCount: resp.data.totalProductCount,
			})
			const list = resp.data.data
			// console.log('list :', list)
			const clothes = resp.data.data.filter((item)=>item.category.some( cat =>CLOTHES_CATEGORY.includes(cat)))
			console.log('클로즈리스트:', clothes)

			const computers =resp.data.data.filter((item)=>item.category.some(cat =>COMPUTER_CATEGORY.includes(cat)))
			console.log('컴퓨터/가전 리스트:', computers)

			set({
				productList: [...list],    	initialProductList:[...list],
				clothesList: clothes,
				computerList: computers
			})	
		}catch(e){
			console.log('e.error:', e.error)
			set({error: e.error})
			// uiStore.getState().showToastMessage(e.error, 'error');
			// payment페이지처럼 페이지네이션 안된 곳에서 에러메시지 안나오도록
		}
	},

	selectProduct:(id)=>{
		const selectedOne = get().productList.find((item)=> item._id === id)
		set({selectedProduct: selectedOne})
	},
	selectClothes:(id)=>{
		const selectedOne = get().clothesList.find((item)=> item._id === id)
		set({selectedClothes: selectedOne})
	},
	selectComputer:(id)=>{
		const selectedOne = get().computerList.find((item)=> item._id === id)
		set({selectedComputer: selectedOne})
	},
	createProduct:async(formData, navigate)=>{
		console.log('store로 받은 formData :', formData)
		try{
			const resp = await api.post('/product', formData)
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
			console.log('e.error:', e.error)
			set({error: e.error})
			uiStore.getState().showToastMessage(e.error, 'error');
		}
	},
	batchCreateProducts:async(formData,navigate)=>{
		try{
			const resp = await api.post('/product/batch', formData)
			console.log('성공한 데이터:', resp.data.data)
			uiStore.getState().showToastMessage('상품 일괄가입을 완료했습니다.', 'success');

			set((state)=>({
				productList: [...state.productList, ...resp.data.data],
				newProductList:[...state.newProductList, ...resp.data.data],
				productUpdated: !state.productUpdated
			}))
			navigate('/admin/product')
			//이렇게 productList를 업데이트하면서 업데이트 될 것 같지만 그렇지 않다.
			// 동일한 페이지로 라우팅되고, url주소만 표시된다.
			// 실제적으로 업데이트가 되게 하려면, productUpdated 값을 구독하게 만들어서, useEffect를 
			// 실시해서 getProductList()하게 만들어야 된다.

		}catch(e){
			console.log('e.error:', e.error)
			set({error: e.error})
			uiStore.getState().showToastMessage(e.error, 'error');
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
			console.log('e.error:', e.error)
			set({error: e.error})
			uiStore.getState().showToastMessage(e.error, 'error');
		}
	},
	deleteProduct:async(id,navigate)=>{
		console.log('store로 받은 id :', id)
		try{
			const resp = await api.delete('/product/'+id)
			console.log('성공한 메시지:', resp.data.message)
			uiStore.getState().showToastMessage('상품이 삭제되었습니다.', 'success');		
			set((state)=>({
				productUpdated: !state.productUpdated
			}))		
			
			navigate('/admin/product')
			//이렇게 하면, 페이지가 열리면서 자연스럽게 새로운 productList를 받아오게 된다.

		}catch(e){
			console.log('e.error:', e.error)
			set({error: e.error})
			uiStore.getState().showToastMessage(e.error, 'error');
		}
	},
	getProduct:async(id)=>{
		console.log('store로 받은 id :', id)
		try{
			const resp = await api.get('/product/'+id)
			console.log('성공한 데이터:', resp.data.data)
			set({selectedProduct: resp.data.data})
			// uiStore.getState().showToastMessage('상품 정보 획득.', 'success'); 과잉메시지라서 

			// navigate('/product/'+id) 현재페이지 url이 바뀔 필요없다.

		}catch(e){
			console.log('e.error:', e.error)
			set({error: e.error})
			uiStore.getState().showToastMessage(e.error, 'error');
		}
	}
}))

export default productStore;