import { useState, useEffect } from 'react'

// ✅ YOUR CORRECT CSV LINK - ALREADY FILLED!
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRs-e_X_QJEeZ9o2Uy4ofj5ZrllhmW-iMr2Kile4GxRHo7jFeKAjCAKY6jgthjMrkYAR0WgF615EI89/pub?output=csv'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const response = await fetch(CSV_URL)
      const csvText = await response.text()
      
      // Parse CSV
      const lines = csvText.split('\n')
      const items = lines.slice(1).map(line => {
        const cols = line.split(',')
        return {
          name: cols[0]?.trim() || 'No name',
          price: cols[1]?.trim() || '0',
          image: cols[2]?.trim() || '',
          description: cols[3]?.trim() || ''
        }
      }).filter(item => item.name !== 'No name' && item.name !== '')
      
      setProducts(items)
    } catch (error) {
      alert('❌ Error loading products! Check your CSV link.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const [isAdmin, setIsAdmin] = useState(false)

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '50px', fontSize: '20px' }}>
      ⏳ Loading products...
    </div>
  )

  return (
    <div style={{ padding: '15px', maxWidth: '500px', margin: 'auto' }}>
      <h1 
        style={{ textAlign: 'center', cursor: 'pointer' }}
        onClick={() => {
          const count = parseInt(localStorage.getItem('tapCount') || '0')
          if (count >= 4) {
            setIsAdmin(!isAdmin)
            localStorage.setItem('tapCount', '0')
          } else {
            localStorage.setItem('tapCount', String(count + 1))
          }
        }}
      >
        🛍️ Grand Market
      </h1>

      {products.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No products. Add some to your Google Sheet!</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {products.map((p, i) => (
            <div key={i} style={{
              border: '1px solid #ddd',
              padding: '15px',
              borderRadius: '12px',
              background: 'white'
            }}>
              {p.image && p.image !== '' && (
                <img 
                  src={p.image} 
                  alt={p.name}
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              )}
              <h3>{p.name}</h3>
              <p style={{ fontSize: '22px', color: '#2e7d32', fontWeight: 'bold' }}>
                ₹{p.price}
              </p>
              <p style={{ color: '#666' }}>{p.description}</p>
            </div>
          ))}
        </div>
      )}

      {isAdmin && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#f5f5f5',
          borderRadius: '12px'
        }}>
          <h3>📝 How to Add Products:</h3>
          <ol style={{ paddingLeft: '20px' }}>
            <li>Open your Google Sheet</li>
            <li>Add rows with: <strong>Name, Price, Image URL, Description</strong></li>
            <li>Refresh this page</li>
          </ol>
          <a 
            href="https://docs.google.com/spreadsheets/d/1-m2Zgl024RLO82TUb0QlqrAS7o7FgtqM9afpzEA31g8/edit"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '12px',
              background: '#4285f4',
              color: 'white',
              textAlign: 'center',
              textDecoration: 'none',
              borderRadius: '8px',
              marginTop: '10px'
            }}
          >
            📱 Open Your Google Sheet
          </a>
        </div>
      )}
    </div>
  )
}

export default App
