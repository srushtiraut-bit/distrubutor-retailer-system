import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDistributors } from '../../api/distributorApi';
import './SelectDistributor.css';

const SelectDistributor = () => {
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const res = await getAllDistributors();
        setDistributors(res.data);
      } catch (err) {
        setError('Failed to load distributors. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDistributors();
  }, []);

  return (
    <div className="select-distributor-page">
      <header className="sd-header">
        <div className="sd-logo">
          <div className="sd-logo-icon">S</div>
          <span>SmartSupply</span>
        </div>
        <button className="sd-back-btn" onClick={() => navigate('/retailer/dashboard')}>
          ← Back to Dashboard
        </button>
      </header>

      <main className="sd-main">
        <h1>Select a Distributor</h1>
        <p className="sd-subtitle">
          Choose a distributor to browse their products and place an order.
        </p>

        {!loading && !error && (
          <p className="sd-count">{distributors.length} distributors available</p>
        )}

        {loading && (
          <div className="sd-state">
            <div className="sd-spinner" />
            <p>Loading distributors...</p>
          </div>
        )}

        {error && (
          <div className="sd-state sd-error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && distributors.length === 0 && (
          <div className="sd-state">
            <p>No distributors available right now.</p>
          </div>
        )}

        {!loading && !error && distributors.length > 0 && (
          <div className="sd-grid">
            {distributors.map((d) => (
              <div key={d.Distributor_ID} className="sd-card">
                <div className="sd-card-top">
                  <div className="sd-avatar">{d.Name?.charAt(0)}</div>
                  <span className="sd-badge">Available</span>
                </div>

                <h3>{d.Name}</h3>
                <p className="sd-type">{d.Type_of_Shop}</p>

                <div className="sd-detail">
                  <span className="sd-icon">📍</span>
                  <span>{d.Address}</span>
                </div>
                <div className="sd-detail">
                  <span className="sd-icon">📞</span>
                  <span>{d.Contact}</span>
                </div>

                <button
                  className="sd-browse-btn"
                  onClick={() => navigate(`/retailer/browse-products/${d.Distributor_ID}`)}
                >
                  Browse Products
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SelectDistributor;