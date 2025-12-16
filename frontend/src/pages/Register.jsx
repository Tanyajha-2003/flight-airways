import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

const API_BASE = process.env.REACT_APP_API_BASE;

const Register = ({ setUser }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error('All fields are required');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/auth/register`, form);

      const user = {
        id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        walletBalance: res.data.user.wallet_balance
      };

      localStorage.setItem('flightUser', JSON.stringify(user));
      setUser(user);

      toast.success('Account created successfully 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-airline">
  <div className="card-register">
    <h2 className="heading">Create Account</h2>

    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="input-group">
        <FiUser className="icon" />
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div className="input-group">
        <FiMail className="icon" />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div className="input-group">
        <FiLock className="icon" />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary-1">
        {loading ? 'Creating...' : 'Register'}
      </button>
    </form>

    <p className="text-sm text-center mt-4">
      Already have an account? <Link to="/login" className="footer-link">Login</Link>
    </p>

    <p className="wallet-bonus">🎁 Wallet bonus: ₹50,000</p>
  </div>
</div>

  );
};

export default Register;
