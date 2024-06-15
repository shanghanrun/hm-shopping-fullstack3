const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const indexRouter = require('./routes/index');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');

const app = express();

require('dotenv').config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // URL 인식
app.use(bodyParser.json()); // req.body가 객체로 인식이 된다.
app.use('/api', indexRouter);

// MongoDB 연결 설정
const mongoURI = process.env.CLOUD_DB;
mongoose.connect(mongoURI)
  .then(() => console.log('mongoose connected'))
  .catch((e) => console.log('DB connection fail', e.message));

// Product 모델 정의 또는 가져오기
const Product = require('./model/Product'); // 모델 파일 경로에 맞게 수정

// MongoDB 데이터를 CSV로 변환하기
app.get('/api/products-csv-to-localDb', async (req, res) => {
  try {
    const products = await Product.find().lean();
    const csvWriter = createCsvWriter({
      path: path.join(__dirname, 'products.csv'), // 서버에 저장될 경로
      header: [
        { id: 'sku', title: 'SKU' },
        { id: 'name', title: 'Name' },
        { id: 'chosung', title: 'Chosung' },
        { id: 'image', title: 'Image' },
        { id: 'price', title: 'Price' },
        { id: 'category', title: 'Category' },
        { id: 'description', title: 'Description' },
        { id: 'stock', title: 'Stock' },
        { id: 'status', title: 'Status' },
        { id: 'isDeleted', title: 'IsDeleted' },
        { id: 'createdAt', title: 'Created At' },
        { id: 'updatedAt', title: 'Updated At' }
      ]
    });

    const records = products.map(product => ({
      sku: product.sku,
      name: product.name,
      chosung: JSON.stringify(product.chosung),
      image: product.image,
      price: product.price,
      category: JSON.stringify(product.category),
      description: product.description,
      stock: JSON.stringify(product.stock),
      status: product.status,
      isDeleted: product.isDeleted,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }));

    await csvWriter.writeRecords(records);
    console.log('CSV file was written successfully');

    // CSV 파일이 생성되었다는 응답을 클라이언트에 보냅니다.
    res.status(200).send('CSV file was written successfully and stored on the server.');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while exporting the data.');
  }
});


// CSV 파일을 읽고 MongoDB로 데이터를 삽입하는 엔드포인트 추가
app.get('/api/import-products-csv', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'products.csv');
    const products = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        products.push({
          sku: row.SKU,
          name: row.Name,
          chosung: JSON.parse(row.Chosung),
          image: row.Image,
          price: parseFloat(row.Price),
          category: JSON.parse(row.Category),
          description: row.Description,
          stock: JSON.parse(row.Stock),
          status: row.Status,
          isDeleted: row.IsDeleted === 'true',
          createdAt: new Date(row['Created At']),
          updatedAt: new Date(row['Updated At']),
        });
      })
      .on('end', async () => {
        // 로컬 MongoDB에 연결
        const localMongoURI = 'mongodb://localhost:27017/hm-shopping3';
        await mongoose.connect(localMongoURI);

        // 기존 컬렉션 데이터 삭제
        await Product.deleteMany({});
        
        // 새로운 데이터 삽입
        await Product.insertMany(products);

        console.log('CSV data imported successfully into local MongoDB');
        res.status(200).send('CSV data imported successfully into local MongoDB.');
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        res.status(500).send('Error reading CSV file.');
      });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while importing the data.');
  }
});






app.listen(process.env.PORT || 5001, () => {
  console.log(`Server is running on port ${process.env.PORT || 5001}`);
});
