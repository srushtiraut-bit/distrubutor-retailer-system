import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { placeOrder } from '../../api/retailerApi';
import './Dashboard.css';

const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { distributorId, items, products } = location.state || {};

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!items || items.length === 0) {
    return (
      <div className="dashboard-container">
        <main className="dashboard-main">
          <div className="orders-card" style={{ padding: '30px' }}>
            <p>No items to order.</p>
            <button onClick={() => navigate('/retailer/select-distributor')}>
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  const getProduct = (productId) =>
    products.find((p) => p.Product_ID === productId);

  const total = items.reduce((sum, item) => {
    const product = getProduct(item.productId);
    return sum + (product ? product.Selling_Price * item.qty : 0);
  }, 0);

  const handleConfirm = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        distributorId,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.qty
        }))
      };
      await placeOrder(payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/retailer/orders');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-label">CHECKOUT</p>
            <h1>Order Summary</h1>
            <p className="dashboard-subtitle">Review your order before confirming</p>
          </div>
        </header>

        <section className="orders-section">
          <div className="orders-card">
            {success ? (
              <div className="empty-orders">
                <div className="empty-icon">✓</div>
                <h3>Order Placed Successfully!</h3>
                <p>Redirecting to your orders...</p>
              </div>
            ) : (
              <>
                {error && <p style={{ color: 'red', padding: '10px' }}>{error}</p>}

                <div className="table-wrapper">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>PRODUCT</th>
                        <th>QUANTITY</th>
                        <th>PRICE</th>
                        <th>SUBTOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => {
                        const product = getProduct(item.productId);
                        if (!product) return null;
                        return (
                          <tr key={item.productId}>
                            <td>{product.Name}</td>
                            <td>{item.qty}</td>
                            <td>₹{product.Selling_Price}</td>
                            <td><strong>₹{(product.Selling_Price * item.qty).toFixed(2)}</strong></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div style={{ padding: '20px', textAlign: 'right', fontSize: '18px' }}>
                  <strong>Total: ₹{total.toFixed(2)}</strong>
                </div>

                <div style={{ padding: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button onClick={() => navigate(-1)} disabled={submitting}>
                    Back
                  </button>
                  <button
                    className="new-order-button"
                    onClick={handleConfirm}
                    disabled={submitting}
                  >
                    {submitting ? 'Placing Order...' : 'Confirm Order'}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PlaceOrder;