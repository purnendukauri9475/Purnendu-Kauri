import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

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

function Home({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(0);
  const [productsLoading, setProductsLoading] = useState(true);

  // =========================
  // USER
  // =========================

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }

    return null;
  });

  const [showLogout, setShowLogout] = useState(false);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowLogout(false);
    navigate("/login");
  };

  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        console.log("HOME PRODUCTS:", data);

        setProducts(data);
        setCurrentProduct(0);
        setProductsLoading(false);
      })
      .catch((error) => {
        console.error("Product fetch error:", error);
        setProductsLoading(false);
      });
  }, []);

  // =========================
  // AUTO SLIDER
  // EVERY 2 SECONDS
  // =========================

  useEffect(() => {
    if (products.length <= 1) {
      return;
    }

    const slider = setInterval(() => {
      setCurrentProduct((previous) => {
        return (previous + 1) % products.length;
      });
    }, 2000);

    return () => clearInterval(slider);
  }, [products.length]);

  // =========================
  // PRODUCT ICON
  // =========================

  const getProductIcon = (category) => {
    if (category === "Mobiles") return "📱";
    if (category === "Laptops") return "💻";
    if (category === "Audio") return "🎧";
    if (category === "Televisions") return "📺";
    if (category === "Wearables") return "⌚";

    return "⚡";
  };

  // =========================
  // GET PRODUCT IMAGE
  // =========================

  const getImage = (product) => {
    if (!product) {
      return "";
    }

    if (
      product.image &&
      (product.image.startsWith("http://") ||
        product.image.startsWith("https://"))
    ) {
      return product.image;
    }

    return productImages[product.name] || "";
  };

  const product = products[currentProduct];
  const image = getImage(product);

  return (
    <div
      className={`home-page ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >
      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="home-navbar">
        <Link to="/" className="home-logo">
          <span>⚡</span>
          Electro<span>Hub</span>
        </Link>

        <div className="home-nav-links">
          <Link to="/" className="home-active">
            Home
          </Link>

          <Link to="/products">
            Products
          </Link>

          <Link to="/cart">
            🛒 Cart
          </Link>

          <Link to="/orders">
            📦 My Orders
          </Link>

          {/* =========================
              USER / LOGIN
          ========================= */}

          {user ? (
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={() => setShowLogout(true)}
              onMouseLeave={() => setShowLogout(false)}
            >
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: darkMode ? "#ffffff" : "#1f2937",
                  padding: "8px 4px",
                }}
              >
                👤 {user.name}
              </button>

              {showLogout && (
                <div
                  style={{
                    position: "absolute",
                    top: "42px",
                    right: "0",
                    background: darkMode
                      ? "#1f2937"
                      : "#ffffff",
                    border: darkMode
                      ? "1px solid #374151"
                      : "1px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "8px",
                    minWidth: "130px",
                    boxShadow:
                      "0 8px 25px rgba(0,0,0,0.18)",
                    zIndex: 1000,
                  }}
                >
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      padding: "9px 14px",
                      border: "none",
                      borderRadius: "7px",
                      background: "#ef4444",
                      color: "#ffffff",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              Login
            </Link>
          )}

          {/* =========================
              DARK / LIGHT MODE
          ========================= */}

          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={
              darkMode
                ? "Switch to Light Mode"
                : "Switch to Dark Mode"
            }
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-small-title">
            WELCOME TO ELECTROHUB
          </p>

          <h1>
            Power Your Life
            <br />
            With Better <span>Technology.</span>
          </h1>

          <p className="hero-description">
            Discover the latest electronics, smart devices,
            laptops, mobiles and accessories — all in one place.
          </p>

          <div className="hero-buttons">
            <Link
              to="/products"
              className="hero-primary-btn"
            >
              Explore Products →
            </Link>

            <Link
              to="/orders"
              className="hero-secondary-btn"
            >
              My Orders
            </Link>
          </div>
        </div>

        {/* =========================
            PRODUCT SLIDER
        ========================= */}

        <div className="hero-device">
          <div className="device-glow"></div>

          <div className="device-card">

            {/* LOADING */}

            {productsLoading && (
              <div className="product-slide">
                <div className="product-slide-fallback">
                  ⚡
                </div>

                <div className="device-info">
                  <span>Loading Products...</span>
                </div>
              </div>
            )}

            {/* PRODUCT */}

            {!productsLoading && product && (
              <div
                className="product-slide"
                key={product.product_id}
              >
                {/* PRODUCT IMAGE */}

                {image ? (
                  <img
                    src={image}
                    alt={product.name}
                    className="product-slide-image"
                    onError={(event) => {
                      console.error(
                        "Image failed:",
                        image
                      );

                      event.currentTarget.style.display =
                        "none";

                      const fallback =
                        event.currentTarget.parentElement.querySelector(
                          ".product-slide-fallback"
                        );

                      if (fallback) {
                        fallback.style.display = "flex";
                      }
                    }}
                  />
                ) : (
                  <div className="product-slide-fallback">
                    {getProductIcon(product.category)}
                  </div>
                )}

                {/* PRODUCT INFORMATION */}

                <div className="device-info">
                  <span>
                    {product.category}
                  </span>

                  <h3>
                    {product.name}
                  </h3>

                  <strong>
                    ₹
                    {Number(product.price).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>
              </div>
            )}

            {/* NO PRODUCTS */}

            {!productsLoading && !product && (
              <div className="product-slide">
                <div className="product-slide-fallback">
                  ⚡
                </div>

                <div className="device-info">
                  <span>
                    No Products
                  </span>

                  <h3>
                    No products available
                  </h3>
                </div>
              </div>
            )}

            {/* =========================
                SLIDER DOTS
            ========================= */}

            {products.length > 1 && (
              <div className="product-dots">
                {products.map((item, index) => (
                  <span
                    key={item.product_id}
                    className={
                      index === currentProduct
                        ? "active"
                        : ""
                    }
                  ></span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================
          CATEGORIES
      ========================= */}

      <section className="categories-section">
        <div className="section-heading">
          <p>SHOP BY CATEGORY</p>

          <h2>
            Everything You
            <br />
            <span>Need.</span>
          </h2>
        </div>

        <div className="category-grid">
          <Link
            to="/products"
            className="category-card"
          >
            <div>📱</div>
            <h3>Mobiles</h3>
            <p>Latest smartphones</p>
          </Link>

          <Link
            to="/products"
            className="category-card"
          >
            <div>💻</div>
            <h3>Laptops</h3>
            <p>Powerful performance</p>
          </Link>

          <Link
            to="/products"
            className="category-card"
          >
            <div>🎧</div>
            <h3>Audio</h3>
            <p>Immersive sound</p>
          </Link>

          <Link
            to="/products"
            className="category-card"
          >
            <div>📺</div>
            <h3>Televisions</h3>
            <p>Entertainment at home</p>
          </Link>

          <Link
            to="/products"
            className="category-card"
          >
            <div>⌚</div>
            <h3>Wearables</h3>
            <p>Smart lifestyle</p>
          </Link>
        </div>
      </section>

      {/* =========================
          WHY ELECTROHUB
      ========================= */}

      <section className="why-section">
        <div className="why-content">
          <p>WHY ELECTROHUB?</p>

          <h2>
            Technology Made
            <br />
            <span>Simple.</span>
          </h2>

          <p className="why-description">
            We make buying electronics easy with quality
            products, transparent pricing and a smooth
            shopping experience.
          </p>

          <div className="why-points">
            <div>
              <span>✓</span>

              <div>
                <strong>
                  Quality Products
                </strong>

                <p>
                  Reliable electronics from trusted brands.
                </p>
              </div>
            </div>

            <div>
              <span>✓</span>

              <div>
                <strong>
                  Secure Shopping
                </strong>

                <p>
                  Your account and orders stay protected.
                </p>
              </div>
            </div>

            <div>
              <span>✓</span>

              <div>
                <strong>
                  Easy Ordering
                </strong>

                <p>
                  Simple cart and checkout experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CTA
      ========================= */}

      <section className="cta-section">
        <div>
          <p>
            READY TO UPGRADE?
          </p>

          <h2>
            Find Your Next
            <br />
            <span>Favorite Device.</span>
          </h2>

          <Link
            to="/products"
            className="cta-button"
          >
            Browse Products →
          </Link>
        </div>
      </section>

      {/* =========================
          AMAZON STYLE FOOTER
      ========================= */}

      <footer className="home-footer">

        <div className="footer-top">

          <div className="footer-column">
            <h3>Get to Know Us</h3>

            <Link to="/">About ElectroHub</Link>
            <Link to="/">Careers</Link>
            <Link to="/">Contact Us</Link>
          </div>

          <div className="footer-column">
            <h3>Make Money with Us</h3>

            <Link to="/products">Sell on ElectroHub</Link>
            <Link to="/products">Advertise Products</Link>
            <Link to="/products">Become a Seller</Link>
          </div>

          <div className="footer-column">
            <h3>Customer Service</h3>

            <Link to="/orders">Your Orders</Link>
            <Link to="/orders">Order Tracking</Link>
            <Link to="/">Help Center</Link>
          </div>

          <div className="footer-column">
            <h3>Connect with Us</h3>

            <Link to="/">Facebook</Link>
            <Link to="/">Instagram</Link>
            <Link to="/">X / Twitter</Link>
          </div>

        </div>

        <div className="footer-divider"></div>

        <div className="footer-brand">

          <div className="footer-logo">
            ⚡ Electro<span>Hub</span>
          </div>

          <div className="footer-options">
            <button type="button">
              🌐 English
            </button>

            <button type="button">
              🇮🇳 India
            </button>
          </div>

        </div>

        <div className="footer-bottom">

          <div className="footer-bottom-links">
            <Link to="/">
              Conditions of Use & Sale
            </Link>

            <Link to="/">
              Privacy Notice
            </Link>

            <Link to="/">
              Interest-Based Ads
            </Link>
          </div>

          <p>
            © 2026 ElectroHub. Electronic Shop Management
            System.
          </p>

        </div>

      </footer>
    </div>
  );
}

export default Home;