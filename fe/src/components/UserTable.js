import React, {useState, useEffect} from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { currencyFormat } from "../utils/number";
import api from './../utils/api';

const UserTable = ({ header, userList, orderList, openEditForm }) => {
  const [userOrders, setUserOrders] = useState({});

  useEffect(() => {
    const fetchUserOrders = async () => {
      const promises = userList.map(async (user) => {
        const resp = await api.get(`order/user-order/${user._id}`);
        return { userId: user._id, orders: resp.data.data };
      });
      const results = await Promise.all(promises);
      const orders = results.reduce((acc, { userId, orders }) => {
        acc[userId] = orders;
        return acc;
      }, {});
      setUserOrders(orders);
    };
    fetchUserOrders();
  }, [userList]);

  return (
    <div className="overflow-x">
      <Table striped bordered hover>
        <thead>
          <tr>
            {header.map((title, index) => (
              <th key={index}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {userList?.length > 0 ? (
            userList.map((user, index) => {
              const userOrder = userOrders[user._id] || { totalPrice: 0 };
              return (
                <tr key={index}>
                  <th>{index}</th>
                  <th>
                    <img src={user.image} width="150px" alt=""/>
                  </th>
                  <th>{user.name}</th>
                  <th style={{ minWidth: "100px" }}>{user.email}</th>
                  <th>{user.level}</th>
                  <th>{currencyFormat(userOrder.totalPrice)}</th>
                  <th>
                    <p>{user.memo}</p>
                    <Button size="sm" onClick={() => openEditForm(user)}>
                      Edit
                    </Button>
                  </th>
                </tr>
              );
            })
          ) : (
            <tr>No Data to show</tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default UserTable;