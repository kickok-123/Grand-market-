import { useState, useEffect } from 'react'
import './styles.css'

// Your existing Google Sheet
const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRs-e_X_QJEeZ9o2Uy4ofj5ZrllhmW-iMr2Kile4GxRHo7jFeKAjCAKY6jgthjMrkYAR0WgF615EI89/pub?output=csv'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [isAdmin, setIsAdmin] = useState(false)

  // Screens
  const [showListingForm, setShowListingForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Listing form
  const [form, setForm] = useState({
    name: '',
    price: '',
    image: '',
    description: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const response = await fetch(CSV_URL)
      const csvText = await response.text()

      const lines = csvText
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)

      const items = lines
        .slice(1)
        .map(line => {
          const cols = parseCSVLine(line)

          return {
            name: cols[0]?.trim() || '',
            price: cols[1]?.trim() || '0',
            image: cols[2]?.trim() || '',
            description: cols[3]?.trim() || ''
          }
        })
        .filter(item => item.name !== '')

      setProducts(items)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Better CSV parser than simple line.split(',')
  function parseCSVLine(line) {
    const result = []
    let current = ''
    let insideQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"' && line[i + 1] === '"') {
        current += '"'
        i++
      } else if (char === '"') {
        insideQuotes = !insideQuotes
      } else if (char === ',' && !insideQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }

    result.push(current)

    return result
  }

  function handleInputChange(event) {
    const { name, value } = event.target

    setForm(previous => ({
      ...previous,
      [name]: value
    }))
  }

  function handleSubmitListing(event) {
    event.preventDefault()

    /*
      FIREBASE WILL GO HERE.

      Later we will save:

      {
        name: form.name,
        price: form.price,
        image: form.image,
        description: form.description,
        status: "pending"
      }

      The admin will then approve/reject the listing.
    */

    // Show success screen
    setShowListingForm(false)
    setShowSuccess(true)

    // Clear form
    setForm({
      name: '',
      price: '',
      image: '',
      description: ''
    })
  }

  function goHome() {
    setShowSuccess(false)
    setShowListingForm(false)
  }

  function openListingForm() {
    setShowSuccess(false)
    setShowListingForm(true)
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading Grand Market...</p>
      </div>
    )
  }

  return (
    <div className="app">

      {/* ================= HEADER ================= */}
      <header>
        <button
          className="logo"
          onClick={goHome}
        >
          🛍️ Grand <span>Market</span>
        </button>

        <nav>
          <button onClick={goHome}>
            Home
          </button>

          <button onClick={openListingForm}>
            Sell
          </button>
        </nav>

        <button
          className="primary header-submit"
          onClick={openListingForm}
        >
          + Submit Listing
        </button>
      </header>


      {/* ================= SUCCESS SCREEN ================= */}
      {showSuccess && (
        <main className="container">

          <section className="success-screen">

            {/* Animated glow */}
            <div className="success-glow"></div>

            {/* Green check animation */}
            <div className="success-icon-area">

              <div className="success-ripple ripple-one"></div>
              <div className="success-ripple ripple-two"></div>

              <div className="success-icon">
                <svg
                  className="checkmark"
                  viewBox="0 0 52 52"
                  aria-hidden="true"
                >
                  <path
                    className="checkmark-path"
                    d="M14 27 L22 35 L39 17"
                  />
                </svg>
              </div>

            </div>


            {/* Success text */}
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


            {/* Approval status */}
            <div className="approval-card">

              <div className="approval-icon">
                <span></span>
              </div>

              <div className="approval-content">
                <strong>
                  Waiting for Admin Approval
                </strong>

                <small>
                  Your product will become visible after approval.
                </small>
              </div>

            </div>


            {/* Back button */}
            <div className="success-actions">

              <button
                className="primary"
                onClick={goHome}
              >
                ← Back to Home
              </button>

            </div>

          </section>

        </main>
      )}


      {/* ================= LISTING FORM ================= */}
      {showListingForm && !showSuccess && (
        <main className="container">

          <section className="form">

            <button
              className="back"
              onClick={goHome}
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
              Add your product details below. Your listing will
              be reviewed by an admin before it becomes public.
            </p>


            <form onSubmit={handleSubmitListing}>

              {/* Product name */}
              <label>
                Product Name

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="e.g. iPhone 15 Pro"
                  required
                />
              </label>


              {/* Price */}
              <label>
                Price

                <div className="price-input">
                  <span>₹</span>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleInputChange}
                    placeholder="45000"
                    min="0"
                    required
                  />
                </div>
              </label>


              {/* Image URL */}
              <label>
                Product Image URL
                <small className="field-help">
                  Add an image URL for now. Firebase Storage will
                  be added later for direct image uploads.
                </small>

                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/product.jpg"
                />
              </label>


              {/* Description */}
              <label>
                Product Description

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="Tell buyers about your product..."
                  rows="6"
                  required
                />
              </label>


              {/* Notice */}
              <div className="submission-notice">

                <div className="notice-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Admin approval required
                  </strong>

                  <span>
                    Your listing will be reviewed before it is
                    visible to other users.
                  </span>
                </div>

              </div>


              <button
                className="primary wide submit-listing-button"
                type="submit"
              >
                Submit Listing
                <span>→</span>
              </button>

            </form>

          </section>

        </main>
      )}


      {/* ================= HOME ================= */}
      {!showSuccess && !showListingForm && (
        <>

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
                  onClick={openListingForm}
                >
                  + Sell a Product
                </button>

                <button
                  className="secondary"
                  onClick={() => {
                    document
                      .getElementById('products')
                      ?.scrollIntoView({
                        behavior: 'smooth'
                      })
                  }}
                >
                  Browse Products
                </button>

              </div>

            </div>


            <div className="hero-card">

              <small>
                LIVE MARKETPLACE
              </small>

              <b>
                {products.length}
              </b>

              <span>
                Products available
              </span>

              <i>
                ✦ New products added regularly
              </i>

            </div>

          </section>


          {/* ================= PRODUCTS ================= */}
          <main
            className="container"
            id="products"
          >

            <div className="head">

              <div>
                <span className="eyebrow">
                  EXPLORE
                </span>

                <h2>
                  Latest Products
                </h2>
              </div>

              <button
                className="primary small"
                onClick={openListingForm}
              >
                + List Product
              </button>

            </div>


            {products.length === 0 ? (

              <div className="empty-products">

                <div>
                  ✦
                </div>

                <h3>
                  No products yet
                </h3>

                <p>
                  Be the first person to list a product.
                </p>

                <button
                  className="primary"
                  onClick={openListingForm}
                >
                  Submit a Listing
                </button>

              </div>

            ) : (

              <div className="grid">

                {products.map((product, index) => (

                  <article
                    className="card"
                    key={index}
                  >

                    {product.image ? (

                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                      />

                    ) : (

                      <div className="product-placeholder">
                        ✦
                      </div>

                    )}

                    <div>

                      <h3>
                        {product.name}
                      </h3>

                      <strong>
                        ₹{product.price}
                      </strong>

                      <span>
                        Available
                      </span>

                      <p className="product-description">
                        {product.description}
                      </p>

                    </div>

                  </article>

                ))}

              </div>

            )}


          </main>


          {/* ================= ADMIN ================= */}
          <div className="container">

            <div className="admin-trigger">

              <button
                className="admin-secret"
                onClick={() => {

                  const count =
                    parseInt(
                      localStorage.getItem('tapCount') || '0'
                    )

                  if (count >= 4) {

                    setIsAdmin(!isAdmin)

                    localStorage.setItem(
                      'tapCount',
                      '0'
                    )

                  } else {

                    localStorage.setItem(
                      'tapCount',
                      String(count + 1)
                    )

                  }

                }}
              >
                •
              </button>

            </div>


            {isAdmin && (

              <div className="admin">

                <div className="admin-head">

                  <div>

                    <span className="eyebrow">
                      ADMIN
                    </span>

                    <h1>
                      Product Management
                    </h1>

                  </div>

                </div>


                <div className="stats">

                  <div>
                    Total Products
                    <b>
                      {products.length}
                    </b>
                  </div>

                  <div>
                    Pending
                    <b>
                      0
                    </b>
                  </div>

                  <div>
                    Approved
                    <b>
                      {products.length}
                    </b>
                  </div>

                </div>


                <div className="notice">

                  <strong>
                    Firebase admin approval will be connected next.
                  </strong>

                  <br />

                  Once Firebase is connected, submitted products
                  will appear here as pending listings.

                </div>

              </div>

            )}

          </div>


          {/* ================= FOOTER ================= */}
          <footer>

            <b>
              🛍️ Grand Market
            </b>

            <span>
              Buy • Sell • Discover
            </span>

            <button onClick={openListingForm}>
              Submit a Listing
            </button>

          </footer>

        </>
      )}

    </div>
  )
}

export default App
