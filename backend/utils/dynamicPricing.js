class DynamicPricing {
  constructor() {
    this.SURGE_THRESHOLD = 3; // 3 attempts
    this.SURGE_WINDOW = 5 * 60 * 1000; // 5 minutes in milliseconds
    this.RESET_WINDOW = 10 * 60 * 1000; // 10 minutes in milliseconds
    this.SURGE_MULTIPLIER = 1.1; // 10% increase
  }

  calculateSurge(flight) {
    const now = new Date();
    const surgeStartTime = flight.surge_start_time;
    
    // Reset surge if 10 minutes have passed
    if (surgeStartTime && (now - surgeStartTime) > this.RESET_WINDOW) {
      return {
        current_price: flight.base_price,
        surge_multiplier: 1.0,
        surge_start_time: null
      };
    }

    // Calculate recent booking attempts
    const recentAttempts = flight.booking_attempts.filter(attempt => {
      return (now - new Date(attempt.attempt_time)) < this.SURGE_WINDOW;
    });

    // Apply surge if threshold met
    if (recentAttempts.length >= this.SURGE_THRESHOLD) {
      const newPrice = Math.round(flight.base_price * this.SURGE_MULTIPLIER);
      
      // Only update surge start time if not already set
      const newSurgeStartTime = surgeStartTime || now;
      
      return {
        current_price: newPrice,
        surge_multiplier: this.SURGE_MULTIPLIER,
        surge_start_time: newSurgeStartTime
      };
    }

    return {
      current_price: flight.base_price,
      surge_multiplier: 1.0,
      surge_start_time: surgeStartTime
    };
  }

  addBookingAttempt(flight, userId) {
    const now = new Date();
    
    // Add new attempt
    flight.booking_attempts.push({
      user_id: userId,
      attempt_time: now
    });

    // Remove attempts older than 10 minutes
    flight.booking_attempts = flight.booking_attempts.filter(attempt => {
      return (now - new Date(attempt.attempt_time)) < (this.RESET_WINDOW * 2);
    });

    return flight;
  }
}

module.exports = new DynamicPricing();