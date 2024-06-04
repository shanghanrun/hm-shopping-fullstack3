import React from "react";
import { Route, Routes } from "react-router";
import AdminOrderPage from "../page/AdminOrderPage";
import AdminProduct from "../page/AdminProduct";
import CartPage from "../page/CartPage";
import Login from "../page/Login";
import MyPage from "../page/MyPage";
import OrderCompletePage from "../page/OrderCompletePage";
import PaymentPage from "../page/PaymentPage";
import ProductAll from "../page/ProductAll";
import ProductDetail from "../page/ProductDetail";
import RegisterPage from "../page/RegisterPage";
import PrivateRoute from "./PrivateRoute";
import AdminAccount from "../page/AdminAccount";
import Clothes from "../page/Clothes";
import Computer from "../page/Computer";
import Movies from "../page/Movies";
import Info from "../page/Info";
import ClothesDetail from "../page/ClothesDetail";
import ComputerDetail from "../page/ComputerDetail";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductAll />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/product/:id" element={<ProductDetail />} />

      <Route path="/all" element={<ProductAll />} />
      <Route path="/clothes" element={<Clothes />} />
      <Route path="/clothes/:id" element={<ClothesDetail />} />
      <Route path="/computer" element={<Computer />} />
      <Route path="/computer/:id" element={<ComputerDetail />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/info" element={<Info />} />

      <Route element={<PrivateRoute permissionLevel="customer" />}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/success" element={<OrderCompletePage />} />
        <Route path="/account/purchase" element={<MyPage />} />
      </Route>
      <Route element={<PrivateRoute permissionLevel="admin" />}>
        <Route path="/admin/product" element={<AdminProduct />} />
        <Route path="/admin/order" element={<AdminOrderPage />} />
        <Route path="/admin/account" element={<AdminAccount />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
