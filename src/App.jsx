import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("electrohub-theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem(
      "electrohub-theme",
      darkMode ? "dark" : "light"
    );

    document.body.className = darkMode
      ? "dark-mode"
      : "light-mode";
  }, [darkMode]);

  return (
    <div
      className={
        darkMode
          ? "app dark-mode"
          : "app light-mode"
      }
    >
      <BrowserRouter>
        <Routes>

          {/* HOME */}
          <Route
            path="/"
            element={
              <Home
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />

          {/* PRODUCTS */}
          <Route
            path="/products"
            element={
              <Products
                darkMode={darkMode}
              />
            }
          />

          {/* CART */}
          <Route
            path="/cart"
            element={
              <Cart
                darkMode={darkMode}
              />
            }
          />

          {/* LOGIN */}
          <Route
            path="/login"
            element={
              <Login
                darkMode={darkMode}
              />
            }
          />

          {/* REGISTER */}
          <Route
            path="/register"
            element={
              <Register
                darkMode={darkMode}
              />
            }
          />

          {/* ORDERS */}
          <Route
            path="/orders"
            element={
              <Orders
                darkMode={darkMode}
              />
            }
          />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;