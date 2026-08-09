import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  const [screen, setScreen] = useState("home");

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // For now this only shows the success screen.
    // Firebase will be connected here next.
    setScreen("success");
  }

  /* ================= SUCCESS SCREEN ================= */

  if (screen === "success") {
    return (
      <div className="success-screen">

        <div className="success-glow"></div>

        <div className="success-icon-area">
          <div className="success-ripple ripple-one"></div>
          <div className="success-ripple ripple-two"></div>

          <div className="success-icon">
            <svg
              className="checkmark"
              viewBox="0 0 52 52"
            >
              <path
                className="checkmark-path"
                d="M14 27 L22 35 L39 17"
              />
            </svg>
          </div>
        </div>

        <div className="success-text">

          <span className="success-label">
            LISTING SUBMITTED
          </span>

          <h1>
            Product Listed
            <br />
            <span>Successfully!</span>
          </h1>

          <p>
            Your product listing has been submitted successfully.
            Our admin will review your listing before it appears
            on Grand Market.
          </p>

        </div>

        <div className="approval-card">

          <div className="approval-icon">
            <span></span>
          </div>

          <div className="approval-content">
            <strong>
              Waiting for Admin Approval
            </strong>

            <small>
              Your product will appear on Grand Market once approved.
            </small>
          </div>

        </div>

        <div className="success-actions">

          <button
            className="primary"
            onClick={() => setScreen("home")}
          >
            ← Back to Home
          </button>

        </div>

      </div>
    );
  }

  /* ================= LISTING FORM ================= */

  if (screen === "form") {
    return (
      <div className="app">

        <header>
          <button
            className="logo"
            onClick={() => setScreen("home")}
          >
            🛍️ Grand <span>Market</span>
          </button>

          <button
            className="primary"
            onClick={() => setScreen("home")}
          >
            Home
          </button>
        </header>

        <main className="container">

          <section className="form">

            <button
              className="back"
              onClick={() => setScreen("home")}
            >
              ← Back
            </button>

            <span className="eyebrow">
              SELL ON GRAND MARKET
            </span>

            <h1>
              Submit Your
              <br />
              <span className="purple-text">
                Product.
              </span>
            </h1>

            <p>
              Add your product details below. Your listing
              will be reviewed by an admin before it becomes public.
            </p>

            <form onSubmit={handleSubmit}>

              <label>
                Product Name

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. iPhone 15 Pro"
                  required
                />
              </label>

              <label>
                Price

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="45000"
                  min="0"
                  required
                />
              </label>

              <label>
                Description

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tell buyers about your product..."
                  rows="6"
                  required
                />
              </label>

              <div className="submission-notice">

                <div className="notice-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Admin approval required
                  </strong>

                  <span>
                    Your listing will be reviewed before
                    it is visible to other users.
                  </span>
                </div>

              </div>

              <button
                type="submit"
                className="primary wide submit-listing-button"
              >
                Submit Listing
                <span>→</span>
              </button>

            </form>

          </section>

        </main>

      </div>
    );
  }

  /* ================= HOME ================= */

  return (
    <div className="app">

      <header>

        <button
          className="logo"
          onClick={() => setScreen("home")}
        >
          🛍️ Grand <span>Market</span>
        </button>

        <nav>
          <button onClick={() => setScreen("home")}>
            Home
          </button>

          <button onClick={() => setScreen("form")}>
            Sell
          </button>
        </nav>

        <button
          className="primary"
          onClick={() => setScreen("form")}
        >
          + Submit Listing
        </button>

      </header>

      <section className="hero">

        <div>

          <span className="eyebrow">
            YOUR LOCAL MARKETPLACE
          </span>

          <h1>
            Buy.
            <br />
            Sell.
            <br />
            <span>Discover.</span>
          </h1>

          <p>
            Find great products from people around you,
            or list something you no longer need.
          </p>

          <div className="actions">

            <button
              className="primary"
              onClick={() => setScreen("form")}
            >
              + Sell a Product
            </button>

            <button className="secondary">
              Browse Products
            </button>

          </div>

        </div>

        <div className="hero-card">

          <small>
            GRAND MARKET
          </small>

          <b>
            ✦
          </b>

          <span>
            Buy • Sell • Discover
          </span>

        </div>

      </section>

    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <App />
);
