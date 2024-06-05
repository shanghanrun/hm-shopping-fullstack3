# 참고로 파이썬코는 다음과 같다.

from pymongo import MongoClient

# 로컬 MongoDB 연결 설정
local_client = MongoClient('mongodb://localhost:27017/')
local_db = local_client['hm-shopping3']
local_collection = local_db['orders']

# MongoDB Atlas 연결 설정
atlas_client = MongoClient(
    'mongodb+srv://idim7:bzeEcNaou6xGibHd@cluster0.dwajw45.mongodb.net/hm-shopping3')
atlas_db = atlas_client['hm-shopping3']
atlas_collection = atlas_db['orders']

# 로컬 컬렉션에서 모든 문서 가져오기
documents = local_collection.find()

# MongoDB Atlas 컬렉션에 문서 삽입
atlas_collection.insert_many(documents)

print("Documents copied successfully!")
