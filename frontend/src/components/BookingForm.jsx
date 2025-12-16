import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiCreditCard } from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const BookingForm = ({ flight, user, onBook }) => {
  /* =========================
     SAFETY GUARD (VERY IMPORTANT)
     ========================= */
  if (!flight || !user) {
    return (
      <div className="text-center mt-24 text-purple-600 text-lg">
        Loading booking details...
      </div>
    );
  }

  /* =========================
     STATE
     ========================= */
  const [passengerInfo, setPassengerInfo] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: ''
  });

  const [isBooking, setIsBooking] = useState(false);

  /* =========================
     SAFE NUMBERS (NO STRING BUGS)
     ========================= */
  const price = Number(flight.current_price);
  const walletBalance = Number(user.walletBalance);
  const hasEnoughBalance = walletBalance >= price;

  /* =========================
     HANDLERS
     ========================= */
  const handleChange = (e) => {
    setPassengerInfo({
      ...passengerInfo,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!hasEnoughBalance) {
    toast.error('Insufficient wallet balance');
    return;
  }

  try {
    setIsBooking(true);
    await onBook(flight.flight_id, passengerInfo);
  } catch (err) {
    toast.error('Something went wrong');
  } finally {
    setIsBooking(false);
  }
};

  /* =========================
     UI
     ========================= */
  return (
    <div className="max-w-4xl mx-auto fade-in">
      <h1 className="text-3xl font-bold text-purple-900 mb-8 text-center">
        Complete Your Booking
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-bold text-purple-900 mb-6">
              Passenger Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">
                  <FiUser className="inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={passengerInfo.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">
                    <FiMail className="inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={passengerInfo.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">
                    <FiPhone className="inline mr-2" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={passengerInfo.phone}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isBooking || !hasEnoughBalance}
                className={`btn-primary w-full ${
                  !hasEnoughBalance ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isBooking ? (
                  <>Processing...</>
                ) : (
                  <>
                    <FiCreditCard className="inline mr-2" />
                    Confirm Booking – ₹{price}
                  </>
                )}
              </button>

              {!hasEnoughBalance && (
                <p className="text-sm text-red-600 text-center">
                  Insufficient wallet balance. Please add funds.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div>
          <div className="card sticky top-8">
            <h2 className="text-xl font-bold text-purple-900 mb-6">
              Flight Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Flight</span>
                <span>
                  {flight.airline} {flight.flight_id}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Route</span>
                <span>
                  {flight.departure_city} → {flight.arrival_city}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Departure</span>
                <span>
                  {format(
                    new Date(flight.departure_time),
                    'MMM dd, hh:mm a'
                  )}
                </span>
              </div>

              <div className="flex justify-between font-bold pt-4 border-t">
                <span>Total</span>
                <span>₹{price}</span>
              </div>
            </div>
          </div>

          <div className="wallet-balance mt-6">
            <h3 className="text-purple-700 font-medium mb-1">
              Your Wallet Balance
            </h3>
            <div className="amount text-2xl font-bold text-purple-900">
              ₹{walletBalance}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;


