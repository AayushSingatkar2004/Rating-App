import { useEffect, useMemo, useState } from 'react';
import { api } from '../../api';
import Table from '../../components/Table';
import SearchBar from '../../components/SearchBar';

export default function AdminStores() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [filters, setFilters] = useState({ name:'', email:'', address:'' });
  const [newStore, setNewStore] = useState({ name:'', email:'', address:'' });

  const load = async () => {
    const { data } = await api.get('/admin/stores', { params: { page, limit, sortBy, order, ...filters } });
    setRows(data.data); setTotal(data.total);
  };
  useEffect(() => { load(); }, [page, sortBy, order, filters]);

  const addStore = async () => {
    await api.post('/admin/stores', newStore);
    setNewStore({ name:'', email:'', address:'' });
    load();
  };

  const columns = useMemo(() => [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'address', title: 'Address' },
    { key: 'rating', title: 'Rating' },
  ], []);

  const onSort = (key) => { if (sortBy === key) setOrder(order==='asc'?'desc':'asc'); else { setSortBy(key); setOrder('asc'); } };

  return (
    <div className="container">
      <h2>Stores</h2>
      <div className="card">
        <SearchBar 
          fields={[
            {key:'name',placeholder:'Name'},
            {key:'email',placeholder:'Email'},
            {key:'address',placeholder:'Address'}
          ]}
          values={filters} 
          onChange={(k,v)=>setFilters(s=>({...s,[k]:v}))} 
          onSubmit={()=>{ setPage(1); load(); }} 
        />
      </div>

      <Table columns={columns} rows={rows} sortBy={sortBy} order={order} onSort={onSort} />

      <div className="row">
        <button disabled={page===1} onClick={()=>setPage(p=>p-1)}>Prev</button>
        <span>Page {page}</span>
        <button disabled={page*limit>=total} onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>

      {/* Add Store */}
      <div className="card">
        <h3>Add Store</h3>
        <input placeholder="Name" value={newStore.name} onChange={e=>setNewStore({...newStore,name:e.target.value})}/>
        <input placeholder="Email" value={newStore.email} onChange={e=>setNewStore({...newStore,email:e.target.value})}/>
        <input placeholder="Address" value={newStore.address} onChange={e=>setNewStore({...newStore,address:e.target.value})}/>
        <button onClick={addStore}>Create</button>
      </div>
    </div>
  );
}
