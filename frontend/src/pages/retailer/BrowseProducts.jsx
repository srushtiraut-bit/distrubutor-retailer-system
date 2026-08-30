import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductsByDistributor } from '../../api/productApi';
import './BrowseProducts.css';

const BrowseProducts = () => {
  const { distributorId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({}); // { productId: quantity }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProductsByDistributor(distributorId);
        setProducts(res.data);
      } catch (err) {
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [distributorId]);

  const updateQuantity = (productId, qty, maxQty) => {
    const clamped = Math.max(0, Math.min(qty, maxQty));
    setCart((prev) => ({ ...prev, [productId]: clamped }));
  };

  const cartItems = Object.entries(cart).filter(([_, qty]) => qty > 0);
  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((sum, [productId, qty]) => {
    const product = products.find((p) => p.Product_ID === Number(productId));
    return sum + (product ? product.Selling_Price * qty : 0);
  }, 0);

  const handleProceed = () => {
    if (cartCount === 0) return;

    const items = cartItems.map(([productId, qty]) => ({
      productId: Number(productId),
      qty
    }));

    navigate('/retailer/place-order', {
      state: { distributorId, items, products }
    });
  };

  return (
    <div className="bp-page">
      <header className="bp-header">
        <div className="bp-logo">
          <div className="bp-logo-icon">S</div>
          <span>SmartSupply</span>
        </div>
        <button className="bp-back-btn" onClick={() => navigate('/retailer/select-distributor')}>
          ← Back to Distributors
        </button>
      </header>

      <main className="bp-main">
        <h1>Browse Products</h1>
        <p className="bp-subtitle">Add items and quantities, then proceed to place your order.</p>

        {loading && (
          <div className="bp-state">
            <div className="bp-spinner" />
            <p>Loading products...</p>
          </div>
        )}

        {error && (
          <div className="bp-state bp-error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="bp-state">
            <p>No products available from this distributor yet.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="bp-table-wrap">
            <table className="bp-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Available</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const available = p.Remaining_Quantity ?? 0;
                  const qty = cart[p.Product_ID] || 0;
                  return (
                    <tr key={p.Product_ID}>
                      <td className="bp-name">{p.Name}</td>
                      <td>
                        <span className="bp-category">{p.Category}</span>
                      </td>
                      <td>₹{p.Selling_Price}</td>
                      <td>
                        <span className={available > 0 ? 'bp-stock-ok' : 'bp-stock-out'}>
                          {available} {p.Unit}
                        </span>
                      </td>
                      <td>
                        <div className="bp-qty-control">
                          <button
                            onClick={() => updateQuantity(p.Product_ID, qty - 1, available)}
                            disabled={qty <= 0}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="0"
                            max={available}
                            value={qty}
                            onChange={(e) =>
                              updateQuantity(p.Product_ID, Number(e.target.value), available)
                            }
                          />
                          <button
                            onClick={() => updateQuantity(p.Product_ID, qty + 1, available)}
                            disabled={qty >= available}
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {cartCount > 0 && (
        <div className="bp-cart-bar">
          <div>
            <strong>{cartCount}</strong> item{cartCount > 1 ? 's' : ''} selected
            <span className="bp-cart-total">₹{cartTotal.toFixed(2)}</span>
          </div>
          <button className="bp-proceed-btn" onClick={handleProceed}>
            Proceed to Order Summary →
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseProducts;