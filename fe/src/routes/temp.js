import React from "react";
import { Route, Routes } from "react-router";
import PrivateRoute from "./PrivateRoute";
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
import AdminAccount from "../page/AdminAccount";
import Clothes from "../page/Clothes";
import cuter from "../page/cuter";
import Movies from "../page/Movies";
import Info from "../page/Info";
import ClothesDetail from "../page/ClothesDetail";
import cuterDetail from "../page/cuterDetail";

const routes = {
  '/': { c: ProductAll },
  '/login': { c: Login },
  '/register': { c: RegisterPage },
  '/product/:id': { c: ProductDetail },
  '/all': { c: ProductAll },
  '/clothes': { c: Clothes },
  '/clothes/:id': { c: ClothesDetail },
  '/cuter': { c: cuter },
  '/cuter/:id': { c: cuterDetail },
  '/movies': { c: Movies },
  '/info': { c: Info },
  '/cart': { c: CartPage, p: true, l: 'customer' },
  '/payment': { c: PaymentPage, p: true, l: 'customer' },
  '/payment/success': { c: OrderCompletePage, p: true, l: 'customer' },
  '/account/purchase': { c: MyPage, p: true, l: 'customer' },
  '/admin/product': { c: AdminProduct, p: true, l: 'admin' },
  '/admin/order': { c: AdminOrderPage, p: true, l: 'admin' },
  '/admin/account': { c: AdminAccount, p: true, l: 'admin' },
};

const AppRouter = () => {
  const renderRoutes = (routes) => {
    return Object.entries(routes).map(([path, { c: Component, p: isPrivate, l }]) => {
      if (isPrivate) {
        return (
          <Route
            key={path}
            element={<PrivateRoute l={l} />}
          >
            <Route path={path} element={<Component />} />
          </Route>
        );
      } else {
        return <Route key={path} path={path} element={<Component />} />;
      }
    });
  };

  return <Routes>{renderRoutes(routes)}</Routes>;
};

export default AppRouter;
