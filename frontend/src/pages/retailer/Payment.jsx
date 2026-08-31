import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { recordPayment } from '../../api/paymentApi';
import './Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, totalBill } = location.state || {};

  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // No order information
  if (!orderId || !totalBill) {
    return (
      <div className="pay-page">
        <div className="pay-empty">
          <h2>No Payment Found</h2>

          <p>
            No order has been selected for payment.
          </p>

          <button
            onClick={() => navigate('/retailer/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // UPI QR data
  const upiString =
    `upi://pay?pa=smartsupply@upi` +
    `&pn=SmartSupply` +
    `&am=${Number(totalBill).toFixed(2)}` +
    `&cu=INR` +
    `&tn=Order${orderId}`;

  // Confirm payment
  const handleConfirmPayment = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await recordPayment({
        orderId: orderId,
        amountPaid: Number(totalBill),
        paymentMode: 'UPI'
      });

      console.log('Payment response:', res.data);

      setSuccess(true);

      setTimeout(() => {
        navigate('/retailer/orders');
      }, 2000);

    } catch (err) {
      console.error('Payment error:', err);

      setError(
        err.response?.data?.message ||
        'Failed to record payment'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pay-page">

      {/* HEADER */}
      <header className="pay-header">
        <div className="pay-logo">

          <div className="pay-logo-icon">
            S
          </div>

          <span>
            SmartSupply
          </span>

        </div>
      </header>


      {/* MAIN */}
      <main className="pay-main">

        {success ? (

          /* ================= SUCCESS ================= */

          <div className="pay-success">

            <div className="pay-success-icon">
              ✓
            </div>

            <h2>
              Payment Successful
            </h2>

            <p>
              Order #{orderId} has been successfully paid.
            </p>

            <p>
              Redirecting to your orders...
            </p>

          </div>

        ) : (

          <>

            <p className="pay-label">
              PAYMENT
            </p>

            <h1>
              Complete Your Payment
            </h1>

            <p className="pay-subtitle">
              Secure payment for your SmartSupply order
            </p>


            {/* ================= BEFORE QR ================= */}

            {!showQR && (

              <div className="pay-card">

                <div className="payment-summary-icon">
                  💳
                </div>

                <h2>
                  Order #{orderId}
                </h2>

                <p className="payment-summary-text">
                  Your order has been created.
                  Complete the payment to finish
                  your purchase.
                </p>


                <div className="payment-amount">

                  <span>
                    Amount to Pay
                  </span>

                  <strong>
                    ₹{Number(totalBill).toFixed(2)}
                  </strong>

                </div>


                {/* PAY NOW */}

                <button
                  className="pay-confirm-btn"
                  onClick={() => {
                    setError('');
                    setShowQR(true);
                  }}
                >
                  Pay Now
                </button>


                <button
                  className="payment-back-btn"
                  onClick={() => navigate(-1)}
                >
                  ← Back
                </button>

              </div>

            )}


            {/* ================= QR PAYMENT ================= */}

            {showQR && (

              <div className="pay-card">

                <h2>
                  Scan & Pay
                </h2>

                <p className="payment-summary-text">
                  Scan this QR code using any
                  UPI app to make the payment.
                </p>


                {/* QR CODE */}

                <div className="pay-qr-wrap">

                  <QRCodeSVG
                    value={upiString}
                    size={210}
                    level="H"
                  />

                </div>


                {/* PAYMENT DETAILS */}

                <div className="pay-details">

                  <div className="pay-row">

                    <span>
                      Order ID
                    </span>

                    <strong>
                      #{orderId}
                    </strong>

                  </div>


                  <div className="pay-row">

                    <span>
                      Amount
                    </span>

                    <strong>
                      ₹{Number(totalBill).toFixed(2)}
                    </strong>

                  </div>


                  <div className="pay-row">

                    <span>
                      Pay to
                    </span>

                    <strong>
                      SmartSupply
                    </strong>

                  </div>

                </div>


                {/* ERROR */}

                {error && (

                  <p className="pay-error">
                    {error}
                  </p>

                )}


                {/* CONFIRM PAYMENT */}

                <button
                  className="pay-confirm-btn"
                  onClick={handleConfirmPayment}
                  disabled={loading}
                >
                  {loading
                    ? 'Confirming Payment...'
                    : "I've Paid — Confirm Payment"}
                </button>


                {/* BACK TO PAY NOW */}

                <button
                  className="payment-back-btn"
                  onClick={() => setShowQR(false)}
                  disabled={loading}
                >
                  ← Back
                </button>

              </div>

            )}

          </>

        )}

      </main>

    </div>
  );
};

export default Payment;