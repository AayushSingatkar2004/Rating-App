import { useEffect, useMemo, useState } from 'react';
import { api } from '../../api';
import Table from '../../components/Table';
import SearchBar from '../../components/SearchBar';

export default function UserStores() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [filters, setFilters] = useState({ name:'', address:'' });
  const [myEdits, setMyEdits] = useState({});

  const load = async () => {
  const params = { page, limit, sortBy, order };

  // add only non-empty filters
  Object.entries(filters).forEach(([key, val]) => {
    if (val && val.trim() !== '') params[key] = val.trim();
  });

  const { data } = await api.get('/stores', { params });  // or '/admin/stores'
  setRows(data.data);
  setTotal(data.total);
};

  useEffect(() => { load(); }, [page, sortBy, order]);

  const submitRating = async (id) => {
    const rating = Number(myEdits[id]);
    if (!rating || rating<1 || rating>5) return alert('Rating must be 1-5');
    await api.post(`/stores/${id}/rating`, { rating });
    setMyEdits(s=>({ ...s, [id]: '' }));
    load();
  };

  const columns = useMemo(() => [
    { key: 'name', title: 'Store Name' },
    { key: 'address', title: 'Address' },
    { key: 'overallRating', title: 'Overall Rating' },
    { key: 'myRating', title: 'My Rating', render: (val, r) => (
      <div className="row">
        <input style={{width:60}} placeholder="1-5" value={myEdits[r.id] ?? val ?? ''} onChange={e=>setMyEdits(s=>({...s,[r.id]:e.target.value}))} />
        <button onClick={()=>submitRating(r.id)}>{val? 'Update' : 'Submit'}</button>
      </div>
    )},
  ], [myEdits]);

  const onSort = (key) => { if (sortBy === key) setOrder(order==='asc'?'desc':'asc'); else { setSortBy(key); setOrder('asc'); } };

  return (
    <div className="container">
      <h2>Browse Stores</h2>
      <div className="card">
        <SearchBar fields={[{key:'name',placeholder:'Name'},{key:'address',placeholder:'Address'}]}
          values={filters} onChange={(k,v)=>setFilters(s=>({...s,[k]:v}))} onSubmit={()=>{ setPage(1); load(); }} />
      </div>
      <Table columns={columns} rows={rows} sortBy={sortBy} order={order} onSort={onSort} />
      <div className="row">
        <button disabled={page===1} onClick={()=>setPage(p=>p-1)}>Prev</button>
        <span>Page {page}</span>
        <button disabled={page*limit>=total} onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  );
}
