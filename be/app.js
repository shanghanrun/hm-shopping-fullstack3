const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const indexRouter = require('./routes/index')

const app = express()

require('dotenv').config()
app.use(cors())
app.use(bodyParser.urlencoded({extended:false})) //url 인식
app.use(bodyParser.json()) // req.body가 객체로 인식이 된다.
app.use('/api', indexRouter)

const mongoURI = process.env.LOCAL_DB
mongoose.connect(mongoURI)
	.then(()=>console.log('mongoose connected'))
	.catch((e)=>console.log("DB connection fail", e.message))

app.listen(process.env.PORT || 5001, ()=>{
	console.log('Server is on 5001')
})