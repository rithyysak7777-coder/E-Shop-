import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { useAuth } from "../hooks/useAuth";
import CustomerNavbar from "./CustomerNavbar";
import Footer from "./Footer";

const CustomerLayout = () => {
  const { cartItems } = useContext(CartContext);
  const { user, HandleLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    HandleLogout();
    navigate("/login");
  };

  return (
    <div
      className="shop-shell d-flex flex-column min-vh-100"
      style={{ fontFamily: "'Inter', sans-serif", background: "#ffffff" }}
    >
      {/* Navbar */}
      <CustomerNavbar
        user={user}
        cartItems={cartItems}
        handleLogoutClick={handleLogoutClick}
      />

      {/* Main Content Area */}
      <main className="flex-grow-1">
        <div className="container-custom">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CustomerLayout;
