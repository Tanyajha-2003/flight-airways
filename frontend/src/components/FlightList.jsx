import React, { useState, useEffect } from 'react';
import { FiClock, FiMapPin, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const FlightList = ({ flights, onSelectFlight, onBookingAttempt }) => {
  const navigate = useNavigate();
  const [attemptTimers, setAttemptTimers] = useState({});

  const handleViewDetails = async (flight) => {
    const result = await onBookingAttempt(flight.flight_id);

    if (result?.surge_reset_time) {
      setAttemptTimers(prev => ({
        ...prev,
        [flight.flight_id]: result.surge_reset_time
      }));
    }

    onSelectFlight(flight);
    navigate('/book');
  };

  const getTimeRemaining = (resetTime) => {
    if (!resetTime) return null;

    const diff = new Date(resetTime) - new Date();
    if (diff <= 0) return null;

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAttemptTimers(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(id => {
          if (!getTimeRemaining(updated[id])) {
            delete updated[id];
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {flights.map((flight) => {
        const isSurge = flight.surge_multiplier > 1;
        const timeRemaining = getTimeRemaining(attemptTimers[flight.flight_id]);

        return (
          <div key={flight.flight_id} className="flight-card-upgraded">
            {/* LEFT */}
            <div className="flight-left">
              <div className="flight-header">
                <div className="flight-title">
                  <span className="airline-name">{flight.airline}</span>
                  <span className="flight-id">{flight.flight_id}</span>
                </div>

                {isSurge && (
                  <span className="surge-badge">
                    <FiTrendingUp /> Surge Active
                  </span>
                )}
              </div>

              <div className="flight-route">
                <div className="city">
                  <FiMapPin />
                  <div>
                    <span className="label">From</span>
                    <strong>{flight.departure_city}</strong>
                  </div>
                </div>

                <div className="route-line">
                  <span />
                  <FiClock />
                  <span />
                </div>

                <div className="city">
                  <FiMapPin />
                  <div>
                    <span className="label">To</span>
                    <strong>{flight.arrival_city}</strong>
                  </div>
                </div>
              </div>

              <div className="flight-meta">
                <div>
                  <FiCalendar />
                  {format(new Date(flight.departure_time), 'MMM dd, hh:mm a')}
                </div>

                <div>
                  <FiClock />
                  {Math.round(
                    (new Date(flight.arrival_time) -
                      new Date(flight.departure_time)) /
                      (1000 * 60 * 60)
                  )}h
                </div>

                <div>
                  <strong>{flight.available_seats}</strong> seats available
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flight-right">
              <div className="price-box">
                {isSurge && (
                  <span className="old-price">₹{flight.base_price}</span>
                )}
                <span className={`price ${isSurge ? 'surge' : ''}`}>
                  ₹{flight.current_price}
                </span>
                {isSurge && (
                  <span className="surge-text">
                    +{((flight.surge_multiplier - 1) * 100).toFixed(0)}%
                  </span>
                )}
              </div>

              {timeRemaining && (
                <div className="countdown">
                  <FiClock /> Resets in {timeRemaining}
                </div>
              )}

              <button
                onClick={() => handleViewDetails(flight)}
                className="book-btn"
              >
                Book Now
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FlightList;
