import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import Navbar from './components/Navbar';
import Protected from './components/Protected';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChangePassword from './pages/ChangePassword';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminStores from './pages/admin/Stores';
import UserStores from './pages/user/Stores';
import OwnerDashboard from './pages/owner/Dashboard';
import './styles.css';

function Home() {
  return (
    <div className="container">
      <h2>Welcome to Store Ratings</h2>
      <p>Login or Signup to continue.</p>
      <ul>
        <li>Admin default (seed): <code>admin@sys.com / Admin@123</code></li>
        <li>Owner example (seed): <code>owner@shop.com / Owner@123</code></li>
      </ul>
      <div className="row">
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/password" element={<Protected><ChangePassword /></Protected>} />

          <Route path="/admin" element={<Protected roles={['ADMIN']}><AdminDashboard /></Protected>} />
          <Route path="/admin/users" element={<Protected roles={['ADMIN']}><AdminUsers /></Protected>} />
          <Route path="/admin/stores" element={<Protected roles={['ADMIN']}><AdminStores /></Protected>} />

          <Route path="/stores" element={<Protected roles={['USER']}><UserStores /></Protected>} />
          <Route path="/owner" element={<Protected roles={['OWNER']}><OwnerDashboard /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
