import React, { useState, useEffect } from "react";
import { Form, Modal, Button, Col, Table } from "react-bootstrap";
import CloudinaryUploadWidget from "../utils/CloudinaryUploadWidget";
import "../style/adminOrder.style.css";
import { LEVEL_STATUS } from "../constants/user.constants";
import { currencyFormat } from "../utils/number";
import userStore from '../store/userStore'

const UserDetailDialog = ({ open, handleClose }) => {
  const {selectedUser, updateUser} = userStore()
  console.log('selectedUser :', selectedUser)
  const [userLevel, setUserLevel] = useState(selectedUser?.level);
  const [userMemo, setUserMemo] = useState(selectedUser?.memo);
  const [userImage, setUserImage]= useState(selectedUser?.image);


  const handleLevelChange = (event) => {
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
    
    await updateUser(selectedUser._id, userLevel, userMemo, userImage);
    handleClose();
  };

  if (!selectedUser) {
    return <></>;
  }
  return (
    <Modal show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Order Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>유저 name: {selectedUser?.name}</p>
        {/* <p>주문날짜: {selectedOrder.updatedAt.slice(0, 10)}</p> */}
        <p>이메일: {selectedUser?.email}</p>
        
        <Form onSubmit={submitNewInfo}>
          <Form.Group as={Col} controlId="level">
            <Form.Label>Level</Form.Label>
            <Form.Select value={userLevel} onChange={handleLevelChange}>
              {LEVEL_STATUS.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} controlId="memo">
            <Form.Label>Memo</Form.Label>
            <Form.Control
              type="text"
              placeholder={selectedUser?.memo}
              value={userMemo}
              onChange={handleMemoChange}
            />
          </Form.Group>

            <Form.Group className="mb-3" controlId="Image" >
              <Form.Label>Image</Form.Label>
              <CloudinaryUploadWidget uploadImage={uploadImage} />

              <img
                id="uploadedimage"
                src={userImage}
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
