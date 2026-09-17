import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Products.css";

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

function Products({ darkMode }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartPopup, setCartPopup] = useState(null);

  const { addToCart, cartItems } = useCart();

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

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
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load products.");
        setLoading(false);
      });
  }, []);

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

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
  // ADD TO CART
  // =========================

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      return;
    }

    const existingItem = cartItems.find(
      (item) => item.id === product.product_id
    );

    const currentQuantity = existingItem
      ? existingItem.quantity
      : 0;

    // PREVENT ADDING MORE THAN STOCK

    if (currentQuantity >= product.stock) {
      setCartPopup({
        type: "warning",
        name: product.name,
        message: `Only ${product.stock} item${
          product.stock === 1 ? "" : "s"
        } available in stock.`,
      });

      setTimeout(() => {
        setCartPopup(null);
      }, 3000);

      return;
    }

    // ADD PRODUCT TO CART

    addToCart({
      id: product.product_id,
      name: product.name,
      category: product.category,
      price: Number(product.price),

      image:
        productImages[product.name] ||
        product.image ||
        "",

      icon: getIcon(product.category),
    });

    const newQuantity = currentQuantity + 1;

    // SUCCESS POPUP

    setCartPopup({
      type: "success",
      name: product.name,
      price: Number(product.price),
      quantity: newQuantity,
      image:
        productImages[product.name] ||
        product.image ||
        "",
      icon: getIcon(product.category),
    });

    setTimeout(() => {
      setCartPopup(null);
    }, 3000);
  };

  return (
    <div
      className={`products-page ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >

      {/* =========================
          CART POPUP
      ========================= */}

      {cartPopup && (
        <div
          className={
            cartPopup.type === "warning"
              ? "cart-popup cart-popup-warning"
              : "cart-popup"
          }
        >
          <div className="cart-popup-icon">
            {cartPopup.type === "warning" ? "!" : "✓"}
          </div>

          <div className="cart-popup-content">
            <strong>
              {cartPopup.type === "warning"
                ? "Stock Limit"
                : "Added to Cart"}
            </strong>

            <span>
              {cartPopup.name}
            </span>

            {cartPopup.type === "success" ? (
              <div className="cart-popup-details">
                <b>
                  Qty: {cartPopup.quantity}
                </b>

                <b>
                  ₹
                  {cartPopup.price.toLocaleString("en-IN")}
                </b>
              </div>
            ) : (
              <div className="cart-popup-warning-text">
                {cartPopup.message}
              </div>
            )}
          </div>

          {cartPopup.type === "success" && (
            <Link
              to="/cart"
              className="cart-popup-link"
            >
              View Cart →
            </Link>
          )}

          <button
            className="cart-popup-close"
            onClick={() => setCartPopup(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="products-navbar">

        <Link
          to="/"
          className="products-logo"
        >
          <span>⚡</span>
          Electro<span>Hub</span>
        </Link>

        <div className="products-nav-links">

          <Link to="/">
            Home
          </Link>

          <Link
            to="/products"
            className="products-active"
          >
            Products
          </Link>

          <Link
            to="/cart"
            className="products-cart"
          >
            🛒 Cart

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </Link>

          <Link to="/orders">
            📦 My Orders
          </Link>

          <Link
            to="/login"
            className="products-login"
          >
            Login
          </Link>

        </div>
      </nav>

      {/* =========================
          HEADER
      ========================= */}

      <div className="products-header">

        <p>
          OUR COLLECTION
        </p>

        <h1>
          All Products
        </h1>

        <span>
          Find the perfect electronics for you.
        </span>

      </div>

      {/* =========================
          SEARCH & FILTER
      ========================= */}

      <div className="filters">

        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option value="All">
            All Categories
          </option>

          <option value="Mobiles">
            Mobiles
          </option>

          <option value="Laptops">
            Laptops
          </option>

          <option value="Audio">
            Audio
          </option>

          <option value="Televisions">
            Televisions
          </option>

          <option value="Wearables">
            Wearables
          </option>
        </select>

      </div>

      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div className="no-products">
          Loading products...
        </div>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {!loading && error && (
        <div className="no-products">
          {error}
        </div>
      )}

      {/* =========================
          PRODUCT GRID
      ========================= */}

      {!loading && !error && (
        <div className="product-grid">

          {filteredProducts.map((product) => {

            const stock =
              Number(product.stock) || 0;

            const outOfStock =
              stock <= 0;

            const lowStock =
              stock > 0 && stock <= 5;

            const image =
              productImages[product.name] ||
              product.image ||
              "";

            return (
              <div
                className="shop-product-card"
                key={product.product_id}
              >

                {/* PRODUCT IMAGE */}

                <div
                  className="shop-product-image"
                  style={{
                    height: "230px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    background: "#f8fafc",
                    borderRadius: "14px",
                    marginBottom: "18px",
                  }}
                >

                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        padding: "15px",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: "70px",
                      }}
                    >
                      {getIcon(product.category)}
                    </span>
                  )}

                </div>

                {/* CATEGORY */}

                <p className="shop-product-category">
                  {product.category}
                </p>

                {/* PRODUCT NAME */}

                <h3>
                  {product.name}
                </h3>

                {/* STOCK STATUS */}

                <div
                  className={
                    outOfStock
                      ? "stock-status stock-out"
                      : lowStock
                      ? "stock-status stock-low"
                      : "stock-status stock-in"
                  }
                >

                  <span className="stock-dot"></span>

                  {outOfStock
                    ? "Out of Stock"
                    : lowStock
                    ? `Only ${stock} left`
                    : `In Stock • ${stock} available`}

                </div>

                {/* PRICE + CART */}

                <div className="shop-product-bottom">

                  <strong>
                    ₹
                    {Number(
                      product.price
                    ).toLocaleString("en-IN")}
                  </strong>

                  <button
                    disabled={outOfStock}
                    className={
                      outOfStock
                        ? "cart-disabled"
                        : ""
                    }
                    onClick={() =>
                      handleAddToCart(product)
                    }
                  >
                    {outOfStock
                      ? "×"
                      : "🛒"}
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* =========================
          NO PRODUCTS
      ========================= */}

      {!loading &&
        !error &&
        filteredProducts.length === 0 && (
          <div className="no-products">
            No products found.
          </div>
        )}

    </div>
  );
}

export default Products;