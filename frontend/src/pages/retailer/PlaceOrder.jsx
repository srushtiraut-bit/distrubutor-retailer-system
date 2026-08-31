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

  if (!items || items.length === 0) {
    return (
      <div className="dashboard-container">
        <main className="dashboard-main">
          <div className="orders-card" style={{ padding: '30px' }}>
            <p>No items to order.</p>

            <button
              className="new-order-button"
              onClick={() =>
                navigate('/retailer/select-distributor')
              }
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  const getProduct = (productId) =>
    products?.find((p) => p.Product_ID === productId);

  const total = items.reduce((sum, item) => {
    const product = getProduct(item.productId);

    return (
      sum +
      (product
        ? product.Selling_Price * item.qty
        : 0)
    );
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

      // Create the order
      const res = await placeOrder(payload);

      console.log('Order response:', res.data);

      /*
        After order creation, go to payment page.

        Your backend should return something similar to:
        {
          orderId: 123,
          totalBill: 1500
        }
      */

      const orderId =
        res.data.orderId ||
        res.data.Order_ID ||
        res.data.order_id;

      const totalBill =
        res.data.totalBill ||
        res.data.Total_Bill ||
        res.data.total_amount ||
        total;

      if (!orderId) {
        throw new Error(
          'Order was created but Order ID was not returned by the server.'
        );
      }

      navigate('/retailer/payment', {
        state: {
          orderId,
          totalBill
        }
      });

    } catch (err) {
      console.error('Place order error:', err);

      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to place order'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">
          <div>
            <p className="dashboard-label">
              CHECKOUT
            </p>

            <h1>Order Summary</h1>

            <p className="dashboard-subtitle">
              Review your order before proceeding to payment
            </p>
          </div>
        </header>


        <section className="orders-section">

          <div className="orders-card">

            {/* ERROR */}

            {error && (
              <div
                style={{
                  margin: '20px',
                  padding: '14px 18px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '10px',
                  color: '#dc2626'
                }}
              >
                {error}
              </div>
            )}


            {/* ORDER ITEMS */}

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

                    const product =
                      getProduct(item.productId);

                    if (!product) return null;

                    const subtotal =
                      product.Selling_Price * item.qty;

                    return (

                      <tr key={item.productId}>

                        <td>
                          <strong>
                            {product.Name}
                          </strong>
                        </td>

                        <td>
                          {item.qty}
                        </td>

                        <td>
                          ₹
                          {Number(
                            product.Selling_Price
                          ).toFixed(2)}
                        </td>

                        <td>
                          <strong>
                            ₹{subtotal.toFixed(2)}
                          </strong>
                        </td>

                      </tr>

                    );
                  })}

                </tbody>

              </table>

            </div>


            {/* TOTAL */}

            <div
              style={{
                padding: '25px 30px',
                display: 'flex',
                justifyContent: 'flex-end',
                borderTop: '1px solid #e5e7eb'
              }}
            >

              <div
                style={{
                  textAlign: 'right'
                }}
              >

                <span
                  style={{
                    display: 'block',
                    color: '#64748b',
                    fontSize: '14px',
                    marginBottom: '5px'
                  }}
                >
                  Total Amount
                </span>

                <strong
                  style={{
                    fontSize: '28px',
                    color: '#111827'
                  }}
                >
                  ₹{total.toFixed(2)}
                </strong>

              </div>

            </div>


            {/* ACTIONS */}

            <div
              style={{
                padding: '0 30px 30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '15px'
              }}
            >

              <button
                className="back-button"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                ← Back
              </button>


              <button
                className="new-order-button"
                onClick={handleConfirm}
                disabled={submitting}
                style={{
                  minWidth: '180px'
                }}
              >

                {submitting
                  ? 'Creating Order...'
                  : 'Proceed to Payment →'}

              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default PlaceOrder;