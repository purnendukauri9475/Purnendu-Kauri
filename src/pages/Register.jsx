import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register({ darkMode }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "http://https://localhost:5000/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setMessage(
        "Registration successful! Redirecting to login..."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError("Unable to connect to server.");
    }
  };

  return (
    <div
      className={`register-page ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >
      {/* LEFT SIDE */}
      <div className="register-left">
        <Link to="/" className="register-logo">
          <span>⚡</span>
          Electro<span>Hub</span>
        </Link>

        <div className="register-content">
          <p className="register-small">JOIN ELECTROHUB</p>

          <h1>
            Create your
            <span> ElectroHub </span>
            account.
          </h1>

          <p className="register-description">
            Create an account to shop electronics, manage your
            orders and enjoy a better shopping experience.
          </p>

          <div className="register-features">
            <div>
              <span>✓</span>
              <p>Easy and secure registration</p>
            </div>

            <div>
              <span>✓</span>
              <p>Track your orders anytime</p>
            </div>

            <div>
              <span>✓</span>
              <p>Quick and simple checkout</p>
            </div>
          </div>
        </div>

        <p className="register-copyright">
          © 2026 ElectroHub
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="register-right">
        <div className="register-card">
          <div className="register-card-header">
            <div className="register-icon">👤</div>
            <h2>Create Account</h2>
            <p>Register for your ElectroHub account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="register-form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="register-form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="register-form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="register-form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {error && (
              <p
                style={{
                  color: "#dc2626",
                  marginBottom: "12px",
                }}
              >
                {error}
              </p>
            )}

            {message && (
              <p
                style={{
                  color: "#16a34a",
                  marginBottom: "12px",
                }}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              className="register-submit"
            >
              Create Account →
            </button>
          </form>

          <div className="register-divider">
            <span>OR</span>
          </div>

          <p className="login-text">
            Already have an account?
            <Link to="/login">Login</Link>
          </p>

          <Link
            to="/"
            className="register-back-home"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;