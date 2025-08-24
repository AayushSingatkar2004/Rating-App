import { useEffect, useState } from 'react';
import { api } from '../../api';
import Stores from './Stores.jsx'

export default function AdminDashboard() {
  const [m, setM] = useState(null);
  useEffect(() => { api.get('/admin/metrics').then(r => setM(r.data)); }, []);
  if (!m) return <div className="container">Loading...</div>;
  return (
    <>
    <div className="container">
      <div>
        <h2>Admin Dashboard</h2>
        <div></div>
      </div>
      <div className="row">
        <div className="card">Total Users: <strong>{m.users}</strong></div>
        <div className="card">Total Stores: <strong>{m.stores}</strong></div>
        <div className="card">Total Ratings: <strong>{m.ratings}</strong></div>
      </div>
    </div>

    <Stores />
    </>
  );
}
