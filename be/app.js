const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const indexRouter = require('./routes/index');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser'); 

const app = express();

require('dotenv').config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // URL 인식
app.use(bodyParser.json()); // req.body가 객체로 인식이 된다.
app.use('/api', indexRouter);


const Product = require('./model/Product'); // 모델 파일 경로에 맞게 수정


// MongoDB 연결 설정
const mongoURI = process.env.CLOUD_DB;
// const mongoURI = process.env.LOCAL_DB;
mongoose.connect(mongoURI)
  .then(() => console.log('mongoose connected'))
  .catch((e) => console.log('DB connection fail', e.message));


  // MongoDB 데이터를 JSON으로 변환하기
app.get('/api/export-products-json', async (req, res) => {
  try {
    const products = await Product.find().lean();

    const filePath = path.join(__dirname, 'products.json'); // 서버에 저장될 경로

    // JSON 파일로 쓰기
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf8');
    console.log('JSON file was written successfully');

    // JSON 파일이 생성되었다는 응답을 클라이언트에 보냅니다.
    res.status(200).send('JSON file was written successfully and stored on the server.');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while exporting the data.');
  }
});


// // Product 모델 정의 또는 가져오기

// // MongoDB 데이터를 CSV로 변환하기
// app.get('/api/export-products-csv', async (req, res) => {
//   try {
//     const products = await Product.find().lean();
//     const csvWriter = createCsvWriter({
//       path: path.join(__dirname, 'products.csv'), // 서버에 저장될 경로
//       header: [
//         { id: 'sku', title: 'SKU' },
//         { id: 'name', title: 'Name' },
//         { id: 'chosung', title: 'Chosung' },
//         { id: 'image', title: 'Image' },
//         { id: 'price', title: 'Price' },
//         { id: 'category', title: 'Category' },
//         { id: 'description', title: 'Description' },
//         { id: 'stock', title: 'Stock' },
//         { id: 'status', title: 'Status' },
//         { id: 'isDeleted', title: 'IsDeleted' },
//         { id: 'createdAt', title: 'Created At' },
//         { id: 'updatedAt', title: 'Updated At' }
//       ]
//     });

//     const records = products.map(product => ({
//       sku: product.sku,
//       name: product.name,
//       chosung: JSON.stringify(product.chosung),
//       image: product.image,
//       price: product.price,
//       category: JSON.stringify(product.category),
//       description: product.description,
//       stock: JSON.stringify(product.stock),
//       status: product.status,
//       isDeleted: product.isDeleted,
//       createdAt: product.createdAt,
//       updatedAt: product.updatedAt
//     }));

//     await csvWriter.writeRecords(records);
//     console.log('CSV file was written successfully');

//     // CSV 파일이 생성되었다는 응답을 클라이언트에 보냅니다.
//     res.status(200).send('CSV file was written successfully and stored on the server.');
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('An error occurred while exporting the data.');
//   }
// });


// CSV 파일을 읽고 MongoDB로 데이터를 삽입하는 엔드포인트 추가
// app.get('/api/products-csv-to-localDB', async (req, res) => {
//   try {
//     const filePath = path.join(__dirname, 'products.csv');
//     const products = [];

//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on('data', (row) => {
//         try {
//           products.push({
//             sku: row.SKU,
//             name: row.Name,
//             chosung: row.Chosung ? JSON.parse(row.Chosung) : [],
//             image: row.Image,
//             price: row.Price ? parseFloat(row.Price) : 0,
//             category: row.Category ? JSON.parse(row.Category) : [],
//             description: row.Description,
//             stock: row.Stock ? JSON.parse(row.Stock) : {},
//             status: row.Status,
//             isDeleted: row.IsDeleted === 'true',
//             createdAt: new Date(row['Created At']),
//             updatedAt: new Date(row['Updated At']),
//           });
//         } catch (error) {
//           console.error('Error parsing row:', row, error);
//         }
//       })
//       .on('end', async () => {
//         try {
//           // 클라우드 MongoDB 연결 해제
//           await mongoose.disconnect();
//           console.log('Disconnected from cloud MongoDB');
          
//           // 로컬 MongoDB에 연결
//           const localMongoURI = 'mongodb://localhost:27017/hm-shopping3';
//           await mongoose.connect(localMongoURI);
//           console.log('Connected to local MongoDB');

//           // 기존 컬렉션 데이터 삭제
//           await Product.deleteMany({});
//           console.log('products 데이터 삭제');
          
//           // 새로운 데이터 삽입
//           await Product.insertMany(products);
//           console.log('products에 데이터 삽입');

//           //확인
//           const savedProducts = await Product.find();
//           console.log('저장한 products :', savedProducts);
//           console.log('CSV data imported successfully into local MongoDB');
//           res.status(200).send('CSV data imported successfully into local MongoDB.');
//         } catch (error) {
//           console.error('Error inserting data into MongoDB:', error);
//           res.status(500).send('Error inserting data into MongoDB.');
//         }
//       })
//       .on('error', (error) => {
//         console.error('Error reading CSV file:', error);
//         res.status(500).send('Error reading CSV file.');
//       });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('An error occurred while importing the data.');
//   }
// });



app.get('/api/products-json-to-localDB', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'products.json');

    // JSON 파일 읽기
    const data = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(data);

    // 클라우드 MongoDB 연결 해제
    await mongoose.disconnect();
    console.log('Disconnected from cloud MongoDB');
    
    // 로컬 MongoDB에 연결
    const localMongoURI = 'mongodb://localhost:27017/hm-shopping3';
    await mongoose.connect(localMongoURI);
    console.log('Connected to local MongoDB');

    // 기존 컬렉션 데이터 삭제
    await Product.deleteMany({});
    console.log('Products 데이터 삭제');
    
    // 새로운 데이터 삽입
    await Product.insertMany(products);
    console.log('Products에 데이터 삽입');

    // 확인
    const savedProducts = await Product.find();
    console.log('저장한 products:', savedProducts);
    console.log('JSON data imported successfully into local MongoDB');
    res.status(200).send('JSON data imported successfully into local MongoDB.');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while importing the data.');
  }
});



app.listen(process.env.PORT || 5001, () => {
  console.log(`Server is running on port ${process.env.PORT || 5001}`);
});
