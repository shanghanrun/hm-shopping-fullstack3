import React, { useState, useEffect } from "react";
import { Form, Modal, Button, Col, Table } from "react-bootstrap";
import CloudinaryUploadWidget from "../utils/CloudinaryUploadWidget";
import "../style/adminOrder.style.css";
import { LEVEL_STATUS } from "../constants/user.constants";
import { currencyFormat } from "../utils/number";
import userStore from '../store/userStore'

const UserDetailDialog = ({ open, handleClose, mode }) => {
  const {selectedUser, updateUser, createNewUser} = userStore()
  console.log('selectedUser :', selectedUser)
  const [userName, setUserName] = useState()
  const [userEmail, setUserEmail] = useState()
  const [userLevel, setUserLevel] = useState();
  const [userMemo, setUserMemo] = useState();
  const [userImage, setUserImage]= useState();

  useEffect(() => {
    if (mode === 'edit' && selectedUser) {
      setUserName(selectedUser.name);
      setUserEmail(selectedUser.email);
      setUserLevel(selectedUser.level);
      setUserMemo(selectedUser.memo);
      setUserImage(selectedUser.image);
    }
  }, [selectedUser, mode]);

  const handleNameChange = (event) => {
    setUserName(event.target.value);
  };
  const handleEmailChange = (event) => {
    setUserEmail(event.target.value);
  };
  const handleLevelChange = (event) => {
    console.log('userLevel :', event.target.value)
    setUserLevel(event.target.value);
  };
  const handleMemoChange = (event) => {
    setUserMemo(event.target.value);
  };
  const uploadImage =(url)=>{
    setUserImage(url)
  }

  const submitNewInfo = async (e) => {
    e.preventDefault(); // 이걸 해야 된다!!
    if(mode ==='new'){
      await createNewUser(userName,userEmail,userLevel,userMemo,userImage)
      //참고로 createNewUser로 만들어진 유저의 패스워드는 모두 '123456'이 된다.
    } else{
      await updateUser(selectedUser._id, userLevel, userMemo, userImage);
    }
    setUserName(''); setUserEmail('');
    setUserImage(''); setUserMemo('');
    setUserLevel('')
    
    handleClose();
  };

  if (!selectedUser) {
    return <></>;
  }
  return (
    <Modal show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>User Detail 정보</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submitNewInfo}>
          {
          (mode ==='new')?
            <div>
              <Form.Group as={Col} controlId="name">
                <Form.Label>name</Form.Label>
                <Form.Control
                  type="text"
                  value={userName}
                  required
                  onChange={handleNameChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="email">
                <Form.Label>email</Form.Label>
                <Form.Control
                  type="text"
                  value={userEmail}
                  required
                  onChange={handleEmailChange}
                />
              </Form.Group>
            </div>
          :
            <div>
              <p>유저 name: {selectedUser?.name}</p>
              <p>이메일: {selectedUser?.email}</p>
            </div>
          }


          <Form.Group as={Col} controlId="level">
            <Form.Label>Level</Form.Label>
            <Form.Select value={userLevel} onChange={handleLevelChange}>
              {LEVEL_STATUS.map((item, idx) => (
                <option key={idx} value={item}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} controlId="memo">
            <Form.Label>Memo</Form.Label>
            <Form.Control
              type="text"
              placeholder={
                (mode === 'new')? '':
                selectedUser?.memo
              }
              value={userMemo}
              onChange={handleMemoChange}
            />
          </Form.Group>

            <Form.Group className="mb-3" controlId="Image" >
              <Form.Label>Image</Form.Label>
              <CloudinaryUploadWidget uploadImage={uploadImage} />

              <img
                id="uploadedimage"
                src={
                  (mode ==='new')? '':
                  selectedUser?.image}
                className="upload-image mt-2"
                alt="uploadedimage"
              />
            </Form.Group>

          <div className="order-button-area">
            <Button
              variant="light"
              onClick={handleClose}
              className="order-button"
            >
              닫기
            </Button>
            <Button type="submit">저장</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UserDetailDialog;
