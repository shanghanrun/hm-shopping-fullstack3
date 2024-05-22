const mongoose =require('mongoose')
const User = require('./User')
const Product = require('./Product')

const Schema = mongoose.Schema
const orderSchema = Schema({
	shipTo:{type: Object, required:true},
	contact:{type: Object, required:true},
	totalPrice:{type:Number, default:0},
	userId:{type:mongoose.ObjectId, ref:User},
	status:{type:String, default:'preparing'},
	isDeleted:{type:Boolean, default:'false'}, //이것도 삭제하지 않고 남겨둔다.
	items:[{
		productId:{type:mongoose.ObjectId, ref:Product},
		name:{type:String, default:''},
		image:{type:String, default:''},
		size:{type:String, required:true},
		qty:{type:Number, default:1, required:true},
		price:{type:Number, required:true}
	}]
},{timestamps:true})

orderSchema.methods.toJSON =function(){
	const obj = this._doc
	delete obj.__v
	delete obj.createdAt
	delete obj.updatedAt
	return obj
}

const Order = mongoose.model("Order", orderSchema)

module.exports = Order;