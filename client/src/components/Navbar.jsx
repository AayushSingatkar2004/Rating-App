import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header>
      <strong>Store Ratings</strong>
      <nav className="navspace">
        <Link to="/">Home</Link>
        {!user && <Link to="/signup">Signup</Link>}
        {!user && <Link to="/login">Login</Link>}
        {user?.role === 'ADMIN' && <Link to="/admin">Manage Stores</Link>}
        {user?.role === 'ADMIN' && <Link to="/admin/users">Manage Users</Link>}
        {user?.role === 'USER' && <Link to="/stores">Stores</Link>}
        {user?.role === 'OWNER' && <Link to="/owner">Owner</Link>}
        {user && <Link to="/password">Change Password</Link>}
      </nav>
      {user ? (
        <div>
          <span className="badge">{user.role}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : null}
    </header>
  );
}
