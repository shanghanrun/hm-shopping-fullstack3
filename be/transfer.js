const { MongoClient } = require('mongodb');

// 로컬 MongoDB 연결 설정
const localUrl = 'mongodb://localhost:27017/';
const localClient = new MongoClient(localUrl);
const localDb = localClient.db('hm-shopping3');
const localCollection = localDb.collection('orders');

// MongoDB Atlas 연결 설정
const atlasUrl = 'mongodb+srv://idim7:bzeEcNaou6xGibHd@cluster0.dwajw45.mongodb.net/hm-shopping3';
const atlasClient = new MongoClient(atlasUrl);
const atlasDb = atlasClient.db('hm-shopping3');
const atlasCollection = atlasDb.collection('orders');

const transferDbData=async()=> {
  try {
    await localClient.connect();
    await atlasClient.connect();

    const documents = await localCollection.find().toArray();

    if (documents.length > 0) {
      await atlasCollection.insertMany(documents);
      console.log("Documents copied successfully!");
    } else {
      console.log("No documents to copy.");
    }
  } catch (error) {
    console.error("Error during data transfer:", error);
  } finally {
    await localClient.close();
    await atlasClient.close();
  }
}

module.exports=transferDbData;