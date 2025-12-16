
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

import Navbar from './components/Navbar';
import FlightSearch from './components/FlightSearch';
import FlightList from './components/FlightList';
import BookingForm from './components/BookingForm';
import Wallet from './components/Wallet';
import BookingHistory from './components/BookingHistory';
import BookingSuccess from './components/BookingSuccess';

import Login from './pages/Login';
import Register from './pages/Register';

import './styles/purple-theme.css';

// const API_BASE = 'http://localhost:5001/api';
const API_BASE = process.env.REACT_APP_API_BASE;
const App = () => {
  const [user, setUser] = useState(null);
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookings, setBookings] = useState([]);

  const navigate = useNavigate();

  /* ======================
     LOAD USER FROM STORAGE
     ====================== */
  useEffect(() => {
    const savedUser = localStorage.getItem('flightUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  /* ======================
     FETCH USER BOOKINGS
     ====================== */
  useEffect(() => {
    if (!user?.id) return;

    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/bookings/user/${user.id}`
        );
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, [user]);

  /* ======================
     FLIGHT SEARCH
     ====================== */
  const handleSearchFlights = async (params) => {
    try {
      const res = await axios.get(`${API_BASE}/api/flights/search`, {
        params
      });
      setFlights(res.data);
    } catch {
      toast.error('Flight search failed');
    }
  };

  /* ======================
     BOOKING ATTEMPT
     ====================== */
  const handleBookingAttempt = async (flightId) => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/flights/${flightId}/attempt`,
        { userId: user.id }
      );

      setFlights(prev =>
        prev.map(f =>
          f.flight_id === flightId
            ? { ...f, current_price: res.data.current_price }
            : f
        )
      );

      if (res.data.surge_active) {
        toast.error('Surge pricing applied!');
      }

      return res.data;
    } catch {
      return null;
    }
  };

  /* ======================
     CONFIRM BOOKING
     ====================== */
  const handleBookFlight = async (flightId, passengerInfo) => {
    try {
      const res = await axios.post(`${API_BASE}/api/bookings`, {
        userId: user.id,
        flightId,
        passengerInfo
      });

      const updatedUser = {
        ...user,
        walletBalance: res.data.new_balance
      };

      setUser(updatedUser);
      localStorage.setItem('flightUser', JSON.stringify(updatedUser));

      setBookings(prev => [res.data.booking, ...prev]);

      navigate('/success', { state: { booking: res.data.booking } });
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed');
      return false;
    }
  };

  /* ======================
     WALLET
     ====================== */
  const handleAddFunds = async (amount) => {
    const res = await axios.post(
      `${API_BASE}/api/wallet/${user.id}/add`,
      { amount }
    );

    const updatedUser = {
      ...user,
      walletBalance: res.data.new_balance
    };

    setUser(updatedUser);
    localStorage.setItem('flightUser', JSON.stringify(updatedUser));
  };

  /* ======================
     LOGOUT
     ====================== */
  const handleLogout = () => {
    localStorage.removeItem('flightUser');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Toaster position="top-right" />

      <Navbar user={user} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <Routes>

          {/* AUTH ROUTES */}
          {!user && (
            <>
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register setUser={setUser} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}

          {/* PROTECTED ROUTES */}
          {user && (
            <>
              <Route
                path="/"
                element={
                  <>
                    <FlightSearch onSearch={handleSearchFlights} />
                    {flights.length > 0 && (
                      <FlightList
                        flights={flights}
                        onSelectFlight={setSelectedFlight}
                        onBookingAttempt={handleBookingAttempt}
                      />
                    )}
                  </>
                }
              />

              <Route
                path="/book"
                element={
                  selectedFlight ? (
                    <BookingForm
                      flight={selectedFlight}
                      user={user}
                      onBook={handleBookFlight}
                    />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />

              <Route path="/success" element={<BookingSuccess />} />
              <Route path="/wallet" element={<Wallet user={user} onAddFunds={handleAddFunds} />} />
              <Route path="/history" element={<BookingHistory bookings={bookings} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}

        </Routes>
      </div>
    </div>
  );
};

export default App;

