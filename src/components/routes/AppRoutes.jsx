import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import NotFound from "../pages/errors/NotFound";
import AdminLayout from "../layouts/AdminLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import UserList from "../pages/users/UserList";
import UserCreate from "../pages/users/UserCreate";
import UserEdit from "../pages/users/UserEdit";
import UserView from "../pages/users/UserView";
import ProductList from "../pages/products/ProductList";
import ProductCreate from "../pages/products/ProductCreate";
import ProductEdit from "../pages/products/ProductEdit";
import ProductView from "../pages/products/ProductView";
import CategoryList from "../pages/categories/CategoryList";
import CategoryCreate from "../pages/categories/CategoryCreate";
import CategoryEdit from "../pages/categories/CategoryEdit";

// New Customer storefront pages
import Cart from "../pages/Frontend/Cart";
import Checkout from "../pages/Frontend/Checkout";
import Orders from "../pages/Frontend/Orders";
import Settings from "../pages/Frontend/Settings";
import Home from "../pages/Frontend/Home";
import Products from "../pages/Frontend/Products";
import ProductDetail from "../pages/Frontend/ProductDetail";
import Contact from "../pages/Frontend/Contact";
import About from "../pages/Frontend/About";
import AdminOrders from "../pages/dashboard/AdminOrders";
import AdminPayments from "../pages/dashboard/AdminPayments";
import AdminSettings from "../pages/dashboard/AdminSettings";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer / Storefront Layout Routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="store" element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="cart" element={<Cart />} />
          <Route
            path="user"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
            path="settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* Children routes for admin panel */}
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/create" element={<UserCreate />} />
          <Route path="users/:id" element={<UserView />} />
          <Route path="users/:id/edit" element={<UserEdit />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/create" element={<ProductCreate />} />
          <Route path="products/:id" element={<ProductView />} />
          <Route path="products/:id/edit" element={<ProductEdit />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="categories/create" element={<CategoryCreate />} />
          <Route path="categories/:id/edit" element={<CategoryEdit />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Not Found page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
