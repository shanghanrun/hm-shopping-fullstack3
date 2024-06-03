import {create} from 'zustand'
import api from '../utils/api'
import uiStore from './uiStore'
import cartStore from './cartStore'

const orderStore =create((set, get)=>({
	totalPrice:0,
	ship:{},
	payment:{},
	orderNum:'임시123',
	selectedOrder:{},
	orderList:[],
	totalPageNum:1,
	allUserOrderList:[],
	totalCount:1,
	setTotalPrice:(val)=>set({totalPrice: val}),
	setShip:(val)=>set({ship: val}),
	setPayment:(val)=>set({payment: val}),
	setSelectedOrder:(orderValue)=> set({selectedOrder: orderValue}),
	updateOrder: async(orderId, newStatus) => {
		try{
			const resp = await api.put('/order', {orderId, newStatus})
			console.log('업데이트되어 프론트로 온 order:', resp.data.updatedOrder)
			set({selectedOrder: resp.data.updatedOrder})

		}catch(e){
			console.log(e.error)
			uiStore.getState().showToastMessage(e.error, 'error');
		}
	},

	addOrder:(val)=>set({orderList:{...val}}),
	createOrder:async(data, navigate)=>{
		try{
			const resp = await api.post('/order', data)
			console.log('오더넘버:',resp.data.orderNum)
			set({orderNum: resp.data.orderNum})
			await cartStore.getState().emptyCart()
			// console.log('비우기 성공')
			//성공메시지는 생략하고, 결제성공 페이지로 이동
			navigate('/payment/success')
			
		}catch(e){
			console.log(e.error)
			uiStore.getState().showToastMessage(e.error, 'error'); 
		}
	},

	getOrderList:async(searchQuery)=>{
		// if(searchQuery.orderNum ===""){
		// 	delete searchQuery.orderNum
		// }
		console.log('getOrderList 서치쿼리', searchQuery)
		try{
			const resp = await api.get('/order',{params:searchQuery})
			console.log('order목록:', resp.data.orderList)
			console.log('page 정보:', resp.data.totalPageNum)
			set({
				orderList: resp.data.orderList,
				totalPageNum: resp.data.totalPageNum
			})	
		}catch(e){
			console.log('e.error:', e.error)
			set({error: e.error})
		}
	},
	getAllUserOrderList:async(searchQuery)=>{  // admin에서 필요한 것
		try{
			const resp = await api.get('/order/all',{params:searchQuery})
			console.log('order목록:', resp.data.data)
			console.log('page 정보:', resp.data.totalPageNum)
			console.log('getAlluserOrerList 객체:', resp)
			set({
				allUserOrderList: resp.data.data,
				totalPageNum: resp.data.totalPageNum,
				totalCount: resp.data.totalCount
			})	
		}catch(e){
			console.log('e.error:', e.error)
			set({error: e.error})
		}
	}
}))

export default orderStore;