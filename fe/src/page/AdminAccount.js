import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import userStore from '../store/userStore'
import uiStore from '../store/uiStore'
import { useNavigate } from "react-router-dom";
import UserTable from "../components/UserTable";
import orderStore from '../store/orderStore'
import UserDetailDialog from "../components/UserDetailDialog";
import SearchBox2 from "../components/SearchBox2.js";

const AdminAccount = () => {
    const {userList, getUserList, setSelectedUser, totalUserCount, batchCreateUsers, userUpdated } = userStore()
    console.log('admin account의 userList :', userList)
  const {getAllUserOrderList, orderList} = orderStore()
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);


  const [searchQuery, setSearchQuery] = useState({
    name: ""})

  const [mode, setMode] = useState("new");
  const tableHeader = [
    "#",
    "Image",
    "Name",
    "Email",
    "Level",
    "Order",
    "Memo",
  ];

  useEffect(()=>{
    getAllUserOrderList() //order 페이지를 위해 미리 데이터를 로딩해 둔다.
  },[])

  useEffect(()=>{
    getUserList(searchQuery) //user정보업데이트 및 searchQeury바뀔 때 발동

    if(searchQuery.name === ''){//이건 브라우저주소창을 위한 설정
      delete searchQuery.name;
    }
    const searchParamsString = new URLSearchParams(searchQuery).toString();
    navigate("?" + searchParamsString )
  },[searchQuery, userUpdated])

 

  const openEditUser = (user) => {
    //edit모드로 설정하고
    // 아이템 수정다이얼로그 열어주기
    setMode('edit')
    setSelectedUser(user)
    setShowDialog(true)
  };
  const handleClose = () => {
    setShowDialog(false);
  };

  const handleClickNewUser = () => {
    //new 모드로 설정하고
    setMode('new')
    // 다이얼로그 열어주기
    setShowDialog(true)
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      console.error("파일을 선택해주세요.");
      return;
    }
    console.log('selectedFile :', selectedFile)

    const formData = new FormData();
    console.log('selectedFile :', selectedFile)
    formData.append('file', selectedFile);
    for (let [key, value] of formData.entries()) {
    console.log('store로 전송하는 formData: ', key, value);
}
    batchCreateUsers(formData, navigate)
  };

  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2" 
          style={{display:'flex', gap:'100px'}}
        >
          <SearchBox2
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="유저 이름으로 검색"
            field="name"
          />

           <input type="file" onChange={handleFileChange} accept=".xlsx" />
          <Button variant="danger" onClick={handleUpload}>Add Users(batch)</Button>
        </div>
        <Button className="mt-2 mb-2" onClick={handleClickNewUser}>
          Add New User +
        </Button>

        <div>
          <h5>Total User: {totalUserCount} 명</h5>
        </div>

        <UserTable
          header={tableHeader}
          userList={userList}
          orderList={orderList}
          openEditForm={openEditUser}
        />
        
      </Container>
      <UserDetailDialog open={showDialog} handleClose={handleClose} mode={mode} />

    </div>
  );
};

export default AdminAccount;
