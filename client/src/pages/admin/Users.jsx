import { useEffect, useMemo, useState, useCallback } from 'react';
import { api } from '../../api';
import Table from '../../components/Table';
import SearchBar from '../../components/SearchBar';

export default function AdminUsers() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [filters, setFilters] = useState({ name:'', email:'', address:'', role:'' });

  const [selected, setSelected] = useState(null);
  const [newUser, setNewUser] = useState({ name:'', email:'', address:'', password:'', role:'USER' });

  const load = useCallback(async () => {
    const { data } = await api.get('/admin/users', { 
      params: { page, limit, sortBy, order, ...filters } 
    });
    setRows(data.data);
    setTotal(data.total);
  }, [page, limit, sortBy, order, filters]);

  useEffect(() => { setPage(1); load(); }, [filters,load]);

  const fetchUser = async (id) => {
    const { data } = await api.get(`/admin/users/${id}`);
    setSelected(data);
    console.log(selected)
  };

  const addUser = async () => {
    await api.post('/admin/users', newUser);
    setNewUser({ name:'', email:'', address:'', password:'', role:'USER' });
    load();
  };

  const columns = useMemo(() => [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'address', title: 'Address' },
    { key: 'role', title: 'Role' },
    { key: 'actions', title: 'Actions', render: (row) => (
      <button onClick={() => row?.id && fetchUser(row.id)}>View</button>
    )}
  ], [fetchUser]);

  const onSort = (key) => {
    if (sortBy === key) setOrder(order === 'asc' ? 'desc' : 'asc');
    else { setSortBy(key); setOrder('asc'); }
  };

  return (
    <div className="container">
      <h2>Users</h2>
      <div className="card">
        <SearchBar 
          fields={[
            {key:'name', placeholder:'Name'},
            {key:'email', placeholder:'Email'},
            {key:'address', placeholder:'Address'}
          ]}
          values={filters} 
          onChange={(k,v)=>setFilters(s=>({...s,[k]:v}))} 
          onSubmit={()=>{ setPage(1); load(); }} 
        />
        <div className="row">
          <select value={filters.role} onChange={e=>{ setFilters(s=>({...s, role:e.target.value})); setPage(1); }}>
            <option value="">All Roles</option>
            <option>ADMIN</option>
            <option>USER</option>
            <option>OWNER</option>
          </select>
        </div>
      </div>

      <Table columns={columns} rows={rows} sortBy={sortBy} order={order} onSort={onSort} />

      <div className="row">
        <button disabled={page===1} onClick={()=>setPage(p=>p-1)}>Prev</button>
        <span>Page {page}</span>
        <button disabled={page*limit>=total} onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>

      {/* Add User */}
      <div className="card">
        <h3>Add User</h3>
        <input placeholder="Name" value={newUser.name} onChange={e=>setNewUser({...newUser,name:e.target.value})}/>
        <input placeholder="Email" value={newUser.email} onChange={e=>setNewUser({...newUser,email:e.target.value})}/>
        <input placeholder="Address" value={newUser.address} onChange={e=>setNewUser({...newUser,address:e.target.value})}/>
        <input type="password" placeholder="Password" value={newUser.password} onChange={e=>setNewUser({...newUser,password:e.target.value})}/>
        <select value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})}>
          <option>ADMIN</option>
          <option>USER</option>
          <option>OWNER</option>
        </select>
        {console.log(newUser)}
        <button onClick={addUser}>Create</button>
      </div>

      {/* User Details */}
      {selected && (
        <div className="card">
          <h3>User Details</h3>
          <p>Name: {selected.name}</p>
          <p>Email: {selected.email}</p>
          <p>Address: {selected.address}</p>
          <p>Role: {selected.role || '-'}</p>
          {selected.role === 'OWNER' && <p>Rating: {selected.rating ?? 'N/A'}</p>}
        </div>
      )}
    </div>
  );
}
