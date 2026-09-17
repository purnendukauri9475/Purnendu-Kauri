const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// =========================
// HOME TEST
// =========================

app.get("/", (req, res) => {
  res.send("ElectroHub Backend is Running!");
});


// =========================
// REGISTER API
// =========================

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Database error",
          });
        }

        if (results.length > 0) {
          return res.status(400).json({
            message: "Email already registered",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
          [name, email, hashedPassword],
          (err, result) => {
            if (err) {
              console.error(err);

              return res.status(500).json({
                message: "Registration failed",
              });
            }

            res.status(201).json({
              message: "Registration successful",
              userId: result.insertId,
            });
          }
        );
      }
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// =========================
// LOGIN API
// =========================

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const user = results[0];

      const passwordMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      res.json({
        message: "Login successful",

        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  );
});


// =========================
// GET ALL PRODUCTS API
// =========================

app.get("/api/products", (req, res) => {
  db.query(
    "SELECT * FROM products ORDER BY product_id DESC",
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to fetch products",
        });
      }

      res.json(results);
    }
  );
});


// =====================================================
// ADMIN AUTHENTICATION MIDDLEWARE
// =====================================================

const verifyAdmin = (req, res, next) => {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(401).json({
      message: "Admin login required",
    });
  }

  db.query(
    "SELECT role FROM users WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      if (results[0].role !== "admin") {
        return res.status(403).json({
          message: "Access denied. Admin only.",
        });
      }

      next();
    }
  );
};


// =====================================================
// ADMIN - ADD PRODUCT
// =====================================================

app.post("/api/admin/products", verifyAdmin, (req, res) => {
  const {
    name,
    category,
    price,
    stock,
    description,
    image,
  } = req.body;

  if (!name || !category || price === undefined) {
    return res.status(400).json({
      message: "Name, category and price are required",
    });
  }

  const productStock = stock || 0;
  const productDescription = description || "";
  const productImage = image || "";

  db.query(
    `INSERT INTO products
    (name, category, price, stock, description, image)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      name,
      category,
      price,
      productStock,
      productDescription,
      productImage,
    ],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to add product",
        });
      }

      res.status(201).json({
        message: "Product added successfully",
        productId: result.insertId,
      });
    }
  );
});


// =====================================================
// ADMIN - UPDATE PRODUCT
// =====================================================

app.put(
  "/api/admin/products/:productId",
  verifyAdmin,
  (req, res) => {
    const { productId } = req.params;

    const {
      name,
      category,
      price,
      stock,
      description,
      image,
    } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        message: "Name, category and price are required",
      });
    }

    db.query(
      `UPDATE products
       SET name = ?,
           category = ?,
           price = ?,
           stock = ?,
           description = ?,
           image = ?
       WHERE product_id = ?`,
      [
        name,
        category,
        price,
        stock || 0,
        description || "",
        image || "",
        productId,
      ],
      (err, result) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Failed to update product",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Product not found",
          });
        }

        res.json({
          message: "Product updated successfully",
        });
      }
    );
  }
);


// =====================================================
// ADMIN - DELETE PRODUCT
// =====================================================

app.delete(
  "/api/admin/products/:productId",
  verifyAdmin,
  (req, res) => {
    const { productId } = req.params;

    db.query(
      "DELETE FROM products WHERE product_id = ?",
      [productId],
      (err, result) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message:
              "Unable to delete product. It may be linked to an order.",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Product not found",
          });
        }

        res.json({
          message: "Product deleted successfully",
        });
      }
    );
  }
);


// =====================================================
// CREATE ORDER API
// =====================================================

app.post("/api/orders", (req, res) => {
  const { user_id, items, total_amount } = req.body;

  if (
    !user_id ||
    !Array.isArray(items) ||
    items.length === 0 ||
    !total_amount
  ) {
    return res.status(400).json({
      message: "Invalid order details",
    });
  }

  // Validate quantity
  for (const item of items) {
    if (
      !item.product_id ||
      !item.quantity ||
      item.quantity <= 0
    ) {
      return res.status(400).json({
        message: "Invalid product quantity",
      });
    }
  }

  db.beginTransaction((err) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Transaction failed",
      });
    }

    // Get product IDs
    const productIds = items.map(
      (item) => item.product_id
    );

    // CHECK CURRENT STOCK
    db.query(
      `SELECT product_id, name, stock
       FROM products
       WHERE product_id IN (?)
       FOR UPDATE`,
      [productIds],
      (err, products) => {
        if (err) {
          return db.rollback(() => {
            console.error(err);

            res.status(500).json({
              message: "Failed to check product stock",
            });
          });
        }

        // Check every product
        for (const item of items) {
          const product = products.find(
            (p) => p.product_id === item.product_id
          );

          if (!product) {
            return db.rollback(() => {
              res.status(400).json({
                message:
                  "One or more products were not found.",
              });
            });
          }

          // Check available stock
          if (product.stock < item.quantity) {
            return db.rollback(() => {
              res.status(400).json({
                message:
                  `Not enough stock for ${product.name}. ` +
                  `Available stock: ${product.stock}`,
              });
            });
          }
        }

        // =========================
        // CREATE ORDER
        // =========================

        db.query(
          "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
          [user_id, total_amount],
          (err, result) => {
            if (err) {
              return db.rollback(() => {
                console.error(err);

                res.status(500).json({
                  message: "Failed to create order",
                });
              });
            }

            const orderId = result.insertId;

            // =========================
            // CREATE ORDER ITEMS
            // =========================

            const orderItems = items.map((item) => [
              orderId,
              item.product_id,
              item.quantity,
              item.price,
            ]);

            db.query(
              `INSERT INTO order_items
              (order_id, product_id, quantity, price)
              VALUES ?`,
              [orderItems],
              (err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error(err);

                    res.status(500).json({
                      message:
                        "Failed to save order items",
                    });
                  });
                }

                // =========================
                // DECREASE STOCK
                // =========================

                let completed = 0;
                let stockError = false;

                items.forEach((item) => {
                  db.query(
                    `UPDATE products
                     SET stock = stock - ?
                     WHERE product_id = ?
                     AND stock >= ?`,
                    [
                      item.quantity,
                      item.product_id,
                      item.quantity,
                    ],
                    (err, result) => {
                      if (stockError) {
                        return;
                      }

                      if (err) {
                        stockError = true;

                        return db.rollback(() => {
                          console.error(err);

                          res.status(500).json({
                            message:
                              "Failed to update product stock",
                          });
                        });
                      }

                      if (result.affectedRows === 0) {
                        stockError = true;

                        return db.rollback(() => {
                          res.status(400).json({
                            message:
                              "Product stock changed. Please try again.",
                          });
                        });
                      }

                      completed++;

                      // =========================
                      // COMMIT TRANSACTION
                      // =========================

                      if (
                        completed === items.length
                      ) {
                        db.commit((err) => {
                          if (err) {
                            return db.rollback(() => {
                              console.error(err);

                              res.status(500).json({
                                message:
                                  "Order confirmation failed",
                              });
                            });
                          }

                          res.status(201).json({
                            message:
                              "Order placed successfully",
                            orderId: orderId,
                          });
                        });
                      }
                    }
                  );
                });
              }
            );
          }
        );
      }
    );
  });
});


// =========================
// GET USER ORDERS API
// =========================

app.get("/api/orders/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT
      o.order_id,
      o.total_amount,
      o.status,
      o.order_date,
      oi.order_item_id,
      oi.quantity,
      oi.price,
      p.product_id,
      p.name AS product_name,
      p.category,
      p.image
    FROM orders o
    JOIN order_items oi
      ON o.order_id = oi.order_id
    JOIN products p
      ON oi.product_id = p.product_id
    WHERE o.user_id = ?
    ORDER BY o.order_date DESC, oi.order_item_id ASC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch orders",
      });
    }

    const orders = {};

    results.forEach((row) => {
      if (!orders[row.order_id]) {
        orders[row.order_id] = {
          order_id: row.order_id,
          total_amount: row.total_amount,
          status: row.status,
          order_date: row.order_date,
          items: [],
        };
      }

      orders[row.order_id].items.push({
        product_id: row.product_id,
        product_name: row.product_name,
        category: row.category,
        quantity: row.quantity,
        price: row.price,
        image: row.image,
      });
    });

    res.json(Object.values(orders));
  });
});


// =========================
// START SERVER
// =========================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});