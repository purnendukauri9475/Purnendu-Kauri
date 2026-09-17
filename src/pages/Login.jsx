import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ darkMode }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      const response = await fetch(
        "https://purnendu-kauri.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      // Save logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setMessage(`Welcome, ${data.user.name}!`);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setError("Unable to connect to server.");
    }
  };

  return (
    <div
      className={`login-page ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >
      {/* =========================
          LEFT SIDE
      ========================= */}

      <div className="login-left">
        <Link to="/" className="login-logo">
          <span>⚡</span>
          Electro<span>Hub</span>
        </Link>

        <div className="login-content">
          <p className="login-small">
            WELCOME BACK
          </p>

          <h1>
            Your electronics,
            <span> your way.</span>
          </h1>

          <p className="login-description">
            Login to your ElectroHub account and continue
            shopping your favourite electronics.
          </p>

          <div className="login-features">
            <div>
              <span>✓</span>
              <p>Easy and secure shopping</p>
            </div>

            <div>
              <span>✓</span>
              <p>Track your orders anytime</p>
            </div>

            <div>
              <span>✓</span>
              <p>Manage your account easily</p>
            </div>
          </div>
        </div>

        <p className="login-copyright">
          © 2026 ElectroHub
        </p>
      </div>

      {/* =========================
          RIGHT SIDE
      ========================= */}

      <div className="login-right">
        <div className="login-card">

          <div className="login-card-header">
            <div className="login-icon">
              🔐
            </div>

            <h2>
              Welcome Back
            </h2>

            <p>
              Login to your ElectroHub account
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="login-form-group">
              <label>
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="login-form-group">
              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>

              <a
                href="#"
                onClick={(e) =>
                  e.preventDefault()
                }
              >
                Forgot Password?
              </a>
            </div>

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            {message && (
              <p className="login-success">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="login-submit"
            >
              Login →
            </button>

          </form>

          <div className="login-divider">
            <span>OR</span>
          </div>

          <p className="register-text">
            Don't have an account?

            <Link to="/register">
              Create Account
            </Link>
          </p>

          <Link
            to="/"
            className="login-back-home"
          >
            ← Back to Home
          </Link>

        </div>
      </div>
    </div>
  );
}

export default Login;