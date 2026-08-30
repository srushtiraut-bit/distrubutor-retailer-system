import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDistributors } from '../../api/distributorApi';

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
        setError('Failed to load distributors');
      } finally {
        setLoading(false);
      }
    };
    fetchDistributors();
  }, []);

  if (loading) return <p>Loading distributors...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Select a Distributor</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {distributors.map((d) => (
          <div
            key={d.Distributor_ID}
            onClick={() => navigate(`/retailer/browse-products/${d.Distributor_ID}`)}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer'
            }}
          >
            <h3>{d.Name}</h3>
            <p>{d.Type_of_Shop}</p>
            <p>{d.Address}</p>
            <p>{d.Contact}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectDistributor;