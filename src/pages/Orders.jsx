import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Orders.css";

// =========================
// PRODUCT IMAGES
// =========================

const productImages = {
  "iPhone 15":
    "https://api.icity-store.ru/images/icity-image-692989054f3c90.42557046.png",

  "Samsung Galaxy S24":
    "https://minapi.beemarket.uz/prod-media/productImages/1718258906Zas3Xve3LQDA.webp",

  "HP Pavilion Laptop":
    "https://www.hp.com/content/dam/sites/worldwide/personal-computers/consumer/pavilion/home/Felicette%20-%20Pavlion%2015%20Laptop%20%28Natural%20Silver%29-%20Image%20-%20Product%20Card%403x.jpg",

  "Dell Inspiron 15":
    "https://brightstarcomp.com/cdn/shop/files/Web_Inspiron_15_3530_1.jpg?v=1754552071",

  "Sony WH-1000XM5":
    "https://i03.hsncdn.com/is/image/HomeShoppingNetwork/rocs1200/sony-wh-1000xm5-wireless-noise-canceling-headphones-d-20241113172142993~23440440w_001.jpg",

  "JBL Bluetooth Speaker":
    "https://freepngimg.com/save/134178-speakers-jbl-amplifier-audio-hq-image-free/1500x1500",

  "Samsung 55-inch 4K TV":
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Samsung_TV.jpg",

  "Apple Watch Series 10":
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Apple_Watch_Series_10.jpg",
};

// =========================
// PRODUCT ICON
// =========================

const getIcon = (category) => {
  if (category === "Mobiles") return "📱";
  if (category === "Laptops") return "💻";
  if (category === "Audio") return "🎧";
  if (category === "Televisions") return "📺";
  if (category === "Wearables") return "⌚";

  return "⚡";
};

// =========================
// STATUS PROGRESS
// =========================

const getStatusStep = (status) => {
  if (status === "Pending") return 0;
  if (status === "Confirmed") return 1;
  if (status === "Shipped") return 2;
  if (status === "Delivered") return 3;

  return 0;
};

// =========================
// PRODUCT COLOR
// ONLY MOBILE PHONES
// =========================

const getProductColor = (productName) => {
  if (productName === "iPhone 15") {
    return {
      name: "Blue",
      color: "#2563eb",
    };
  }

  if (productName === "Samsung Galaxy S24") {
    return {
      name: "Black",
      color: "#18181b",
    };
  }

  return null;
};

// =========================
// ORDERS COMPONENT
// =========================

function Orders({ darkMode }) {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetch(`http://https://localhost:5000/api/orders/${user.user_id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        return response.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [navigate, user]);

  return (
    <div
      className={`orders-page ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >
      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="orders-navbar">
        <Link to="/" className="orders-logo">
          <span>⚡</span>
          Electro<span>Hub</span>
        </Link>

        <div className="orders-nav-links">
          <Link to="/">Home</Link>

          <Link to="/products">Products</Link>

          <Link to="/cart">🛒 Cart</Link>

          <Link to="/orders" className="orders-active">
            📦 My Orders
          </Link>
        </div>
      </nav>

      {/* =========================
          HEADER
      ========================= */}

      <section className="orders-header">
        <p>YOUR ORDERS</p>

        <h1>My Orders</h1>

        <span>
          View your order history and order details.
        </span>
      </section>

      {/* =========================
          CONTENT
      ========================= */}

      <section className="orders-content">
        {loading ? (
          <div className="orders-message">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">
              📦
            </div>

            <h2>No Orders Yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <Link
              to="/products"
              className="orders-shop-btn"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const currentStep =
                getStatusStep(order.status);

              const itemCount =
                order.items?.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                ) || 0;

              const steps = [
                "Order Placed",
                "Processing",
                "Shipped",
                "Delivered",
              ];

              return (
                <div
                  className="order-card"
                  key={order.order_id}
                >
                  {/* =========================
                      ORDER HEADER
                  ========================= */}

                  <div className="order-card-header">
                    <div className="order-heading-left">
                      <div className="order-box-icon">
                        📦
                      </div>

                      <div>
                        <p className="order-id-label">
                          ORDER ID
                        </p>

                        <h3 className="order-id">
                          #{order.order_id}
                        </h3>
                      </div>
                    </div>

                    {/* STATUS */}

                    <div
                      className={`order-status ${
                        order.status === "Delivered"
                          ? "delivered"
                          : ""
                      }`}
                    >
                      ● {order.status}
                    </div>
                  </div>

                  {/* =========================
                      ORDER INFO
                  ========================= */}

                  <div className="order-info">
                    <div>
                      <span className="order-info-label">
                        ORDER DATE
                      </span>

                      <strong className="order-info-value">
                        {new Date(
                          order.order_date
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </strong>
                    </div>

                    <div>
                      <span className="order-info-label">
                        TOTAL AMOUNT
                      </span>

                      <strong className="order-total">
                        ₹
                        {Number(
                          order.total_amount
                        ).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>

                  {/* =========================
                      ORDERED PRODUCTS
                  ========================= */}

                  <div className="ordered-products">
                    <div className="ordered-products-heading">
                      <h4>🛍️ Ordered Products</h4>

                      <span className="item-count">
                        {itemCount}{" "}
                        {itemCount === 1
                          ? "item"
                          : "items"}
                      </span>
                    </div>

                    {/* PRODUCT ITEMS */}

                    <div className="order-product-list">
                      {order.items &&
                        order.items.map((item) => {
                          const productColor =
                            getProductColor(
                              item.product_name
                            );

                          const image =
                            productImages[
                              item.product_name
                            ];

                          return (
                            <div
                              key={item.product_id}
                              className="order-product-item"
                            >
                              {/* IMAGE */}

                              <div className="order-product-image">
                                {image ? (
                                  <img
                                    src={image}
                                    alt={item.product_name}
                                    onError={(e) => {
                                      e.currentTarget.style.display =
                                        "none";

                                      if (
                                        e.currentTarget
                                          .nextElementSibling
                                      ) {
                                        e.currentTarget.nextElementSibling.style.display =
                                          "flex";
                                      }
                                    }}
                                  />
                                ) : null}

                                {/* FALLBACK ICON */}

                                <span
                                  className="order-product-fallback"
                                  style={{
                                    display: image
                                      ? "none"
                                      : "flex",
                                  }}
                                >
                                  {getIcon(
                                    item.category
                                  )}
                                </span>
                              </div>

                              {/* PRODUCT INFO */}

                              <div className="order-product-info">
                                <strong>
                                  {item.product_name}
                                </strong>

                                <span>
                                  {item.category}
                                </span>

                                {/* COLOR - MOBILE ONLY */}

                                {productColor && (
                                  <div className="product-color">
                                    <span
                                      className="color-dot"
                                      style={{
                                        background:
                                          productColor.color,
                                      }}
                                    />

                                    <span>
                                      {
                                        productColor.name
                                      }
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* QUANTITY */}

                              <div className="order-quantity">
                                × {item.quantity}
                              </div>

                              {/* PRICE */}

                              <strong className="order-product-price">
                                ₹
                                {(
                                  Number(item.price) *
                                  item.quantity
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </strong>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* =========================
                      ORDER TIMELINE
                  ========================= */}

                  <div className="order-timeline">
                    <div className="timeline">
                      {steps.map((step, index) => {
                        const completed =
                          index <= currentStep;

                        return (
                          <div
                            key={step}
                            className="timeline-step-wrapper"
                          >
                            {/* CIRCLE */}

                            <div
                              className={`timeline-circle ${
                                completed
                                  ? index ===
                                    currentStep
                                    ? "current"
                                    : "completed"
                                  : ""
                              }`}
                            >
                              {completed
                                ? "✓"
                                : index + 1}
                            </div>

                            {/* LINE */}

                            {index <
                              steps.length - 1 && (
                              <div
                                className={`timeline-line ${
                                  index <
                                  currentStep
                                    ? "completed"
                                    : ""
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* LABELS */}

                    <div className="timeline-labels">
                      {steps.map((step, index) => (
                        <div
                          key={step}
                          className={
                            index === 0
                              ? "timeline-label first"
                              : index ===
                                steps.length - 1
                              ? "timeline-label last"
                              : "timeline-label"
                          }
                        >
                          <strong
                            className={
                              index <= currentStep
                                ? "active"
                                : ""
                            }
                          >
                            {step}
                          </strong>

                          {index === 0 && (
                            <span>
                              {new Date(
                                order.order_date
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="orders-footer">
        <div className="orders-footer-logo">
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

export default Orders;