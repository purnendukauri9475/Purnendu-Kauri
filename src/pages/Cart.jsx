import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

function Cart({ darkMode }) {
  const navigate = useNavigate();

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    total,
  } = useCart();

  // Logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Product icon fallback
  const getIcon = (category) => {
    if (category === "Mobiles") return "📱";
    if (category === "Laptops") return "💻";
    if (category === "Audio") return "🎧";
    if (category === "Televisions") return "📺";
    if (category === "Wearables") return "⌚";

    return "⚡";
  };

  // Get correct image URL
  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    // If image is already a full URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // If image is stored as a local filename
    return `/images/${image}`;
  };

  // Checkout
  const handleCheckout = async () => {
    const currentUser = JSON.parse(
      localStorage.getItem("user")
    );

    // Login check
    if (!currentUser) {
      alert("Please login before checkout.");
      navigate("/login");
      return;
    }

    // Empty cart check
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const orderItems = cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    try {
      const response = await fetch(
        "http://https://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: currentUser.user_id,
            items: orderItems,
            total_amount: total,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Failed to place order."
        );
        return;
      }

      // Clear cart after successful order
      clearCart();

      alert(
        `Order placed successfully! Order ID: ${data.orderId}`
      );

      // Go to My Orders
      navigate("/orders");
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server.");
    }
  };

  return (
    <div
      className={`cart-page ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <Link to="/" className="cart-logo">
          <span>⚡</span> Electro<span>Hub</span>
        </Link>

        <div className="cart-nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/products">
            Products
          </Link>

          <Link
            to="/cart"
            className="cart-active"
          >
            🛒 Cart
          </Link>

          {/* USER MENU */}

          {user ? (
            <div className="user-menu">

              <span className="user-name">
                👤 {user.name}
              </span>

              <div className="user-dropdown">
                <button onClick={handleLogout}>
                  Logout
                </button>
              </div>

            </div>
          ) : (
            <Link
              to="/login"
              className="cart-login"
            >
              Login
            </Link>
          )}

        </div>

      </nav>

      {/* ================= CART HEADER ================= */}

      <section className="cart-header">

        <p>
          YOUR SHOPPING CART
        </p>

        <h1>
          Shopping Cart
        </h1>

        <span>
          Review your selected products before checkout.
        </span>

      </section>

      {/* ================= CART CONTENT ================= */}

      <section className="cart-content">

        {/* CART ITEMS */}

        <div className="cart-items">

          {cartItems.length === 0 ? (

            <div className="empty-cart">

              <div className="empty-cart-icon">
                🛒
              </div>

              <h2>
                Your Cart is Empty
              </h2>

              <p>
                You haven't added any products
                to your cart yet.
              </p>

              <Link
                to="/products"
                className="continue-shopping"
              >
                Browse Products →
              </Link>

            </div>

          ) : (

            cartItems.map((item) => (

              <div
                className="cart-item"
                key={item.id}
              >

                {/* PRODUCT IMAGE */}

                <div className="cart-product-icon">

                  {item.image ? (

                    <img
                      src={getImageUrl(item.image)}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";

                        e.currentTarget.nextElementSibling.style.display =
                          "flex";
                      }}
                    />

                  ) : null}

                  {/* FALLBACK ICON */}

                  <span
                    style={{
                      display: item.image
                        ? "none"
                        : "flex",
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "55px",
                    }}
                  >
                    {item.icon ||
                      getIcon(item.category)}
                  </span>

                </div>

                {/* PRODUCT INFO */}

                <div className="cart-product-info">

                  <p>
                    {item.category}
                  </p>

                  <h3>
                    {item.name}
                  </h3>

                  <span>
                    ₹
                    {Number(
                      item.price
                    ).toLocaleString("en-IN")}
                  </span>

                </div>

                {/* QUANTITY */}

                <div className="quantity">

                  <button
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                  >
                    -
                  </button>

                  <strong>
                    {item.quantity}
                  </strong>

                  <button
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                  >
                    +
                  </button>

                </div>

                {/* ITEM TOTAL */}

                <strong className="item-total">

                  ₹
                  {(
                    item.price *
                    item.quantity
                  ).toLocaleString("en-IN")}

                </strong>

                {/* REMOVE */}

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                >
                  ×
                </button>

              </div>

            ))

          )}

        </div>

        {/* ================= ORDER SUMMARY ================= */}

        {cartItems.length > 0 && (

          <div className="order-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                ₹
                {total.toLocaleString("en-IN")}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                Delivery
              </span>

              <strong className="free">
                FREE
              </strong>

            </div>

            <div className="summary-line"></div>

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {total.toLocaleString("en-IN")}
              </strong>

            </div>

            {/* CHECKOUT BUTTON */}

            <button
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout →
            </button>

            <Link
              to="/products"
              className="continue-shopping"
            >
              ← Continue Shopping
            </Link>

          </div>

        )}

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="cart-footer">

        <div className="cart-footer-logo">
          ⚡ Electro<span>Hub</span>
        </div>

        <p>
          Electronic Shop Management System
        </p>

        <small>
          © 2026 ElectroHub. All rights reserved.
        </small>

      </footer>

    </div>
  );
}

export default Cart;