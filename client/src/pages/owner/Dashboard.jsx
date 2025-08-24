import { useEffect, useState } from "react";
import { api } from "../../api";

export default function OwnerDashboard() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [store, setStore] = useState({ name: "", address: "" });

  const fetchStores = async () => {
    const r = await api.get("/owner/dashboard");
    setData(r.data);
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleChange = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/owner/add-store", store);
      setStore({ name: "", address: "" });
      setShowForm(false);
      fetchStores(); // refresh dashboard
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add store");
    }
  };

  return (
    <div className="container">
      <h2>Owner Dashboard</h2>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "➕ Add Store"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="card">
          <input
            type="text"
            name="name"
            placeholder="Store Name"
            value={store.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Store Address"
            value={store.address}
            onChange={handleChange}
            required
          />
          <button type="submit">Save Store</button>
        </form>
      )}

      {data.map((block) => (
        <div key={block.store.id} className="card">
          <h3>{block.store.name}</h3>
          <p>
            Average Rating: <strong>{block.average ?? "—"}</strong>
          </p>
          <h4>Raters</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {block.raters.map((r, i) => (
                <tr key={i}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}


// import { useEffect, useState } from 'react';
// import { api } from '../../api';

// export default function OwnerDashboard() {
//   const [data, setData] = useState([]);
//   useEffect(() => { api.get('/owner/dashboard').then(r => setData(r.data)); }, []);

//   return (
//     <div className="container">
//       <h2>Owner Dashboard</h2>
//       {data.map(block => (
//         <div key={block.store.id} className="card">
//           <h3>{block.store.name}</h3>
//           <p>Average Rating: <strong>{block.average ?? '—'}</strong></p>
//           <h4>Raters</h4>
//           <table className="table">
//             <thead><tr><th>Name</th><th>Email</th><th>Rating</th></tr></thead>
//             <tbody>
//             {block.raters.map((r,i)=> (
//               <tr key={i}><td>{r.name}</td><td>{r.email}</td><td>{r.rating}</td></tr>
//             ))}
//             </tbody>
//           </table>
//         </div>
//       ))}
//     </div>
//   );
// }
