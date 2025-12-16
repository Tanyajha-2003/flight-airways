import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock } from 'react-icons/fi';

const API_BASE = process.env.REACT_APP_API_BASE;

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });

      const user = {
        id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        walletBalance: res.data.user.wallet_balance
      };

      localStorage.setItem('flightUser', JSON.stringify(user));
      setUser(user);

      toast.success('Login successful ✈️');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-airline">
  <div className="card-register ">
    <h1 className="heading">Welcome Back ✈️</h1>

    <div className="space-y-5">
      <div className="input-group">
        <FiMail className="icon" />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="input-group">
        <FiLock className="icon" />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="input-field"
        />
      </div>
    </div>

    <button
      onClick={submit}
      disabled={loading}
      className="btn-primary-1 mt-6 ml-auto pr-8"
    >
      {loading ? 'Logging in...' : 'Login'}
    </button>

    <p className="text-sm text-center mt-4">
      No account yet? <Link to="/register" className="footer-link">Register</Link>
    </p>
  </div>
</div>

  );
}
