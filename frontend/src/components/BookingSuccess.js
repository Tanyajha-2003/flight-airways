// import React from 'react';
// import { CheckCircle } from 'lucide-react';
// import { Link, useLocation, Navigate } from 'react-router-dom';

// export default function BookingSuccess() {
//   const { state } = useLocation();

//   if (!state?.booking) {
//     return <Navigate to="/" />;
//   }

//   const { booking } = state;

//   return (
//     <div className="max-w-3xl mx-auto mt-16 bg-white rounded-2xl shadow-xl p-10 text-center">
//       {/* Success Icon */}
//       <CheckCircle className="mx-auto text-green-500" size={64} />

//       {/* Heading */}
//       <h1 className="text-3xl font-bold mt-4 text-purple-900">
//         Booking Confirmed
//       </h1>

//       {/* PNR */}
//       <p className="mt-2 text-gray-600">
//         PNR: <span className="font-semibold text-purple-900">{booking.pnr}</span>
//       </p>

//       {/* Booking Details Card */}
//       <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-purple-50 p-6 rounded-xl shadow-inner">
//         <div>
//           <p className="text-sm font-semibold text-purple-700">Passenger</p>
//           <p className="text-purple-900 font-medium">{booking.passenger_name}</p>
//         </div>

//         <div>
//           <p className="text-sm font-semibold text-purple-700">Email</p>
//           <p className="text-purple-900 font-medium">{booking.passenger_email}</p>
//         </div>

//         <div>
//           <p className="text-sm font-semibold text-purple-700">Route</p>
//           <p className="text-purple-900 font-medium">
//             {booking.flight_details.departure_city} → {booking.flight_details.arrival_city}
//           </p>
//         </div>

//         <div>
//           <p className="text-sm font-semibold text-purple-700">Amount Paid</p>
//           <p className="text-purple-900 font-bold">₹{booking.final_price}</p>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
//         <a
//           href={`http://localhost:5001/api/bookings/ticket/${booking.pnr}`}
//           className="btn-primary w-full sm:w-auto text-center py-2 px-6"
//         >
//           Download Ticket
//         </a>

//         <Link
//           to="/history"
//           className="btn-secondary w-full sm:w-auto text-center py-2 px-6"
//         >
//           View Bookings
//         </Link>
//       </div>
//     </div>
//   );
// }
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Link, useLocation, Navigate } from 'react-router-dom';

// API base from environment
const API_BASE = process.env.REACT_APP_API_BASE;

export default function BookingSuccess() {
  const { state } = useLocation();

  if (!state?.booking) {
    return <Navigate to="/" />;
  }

  const { booking } = state;

  return (
    <div className="max-w-3xl mx-auto mt-16 bg-white rounded-2xl shadow-xl p-10 text-center">
      {/* Success Icon */}
      <CheckCircle className="mx-auto text-green-500" size={64} />

      {/* Heading */}
      <h1 className="text-3xl font-bold mt-4 text-purple-900">
        Booking Confirmed
      </h1>

      {/* PNR */}
      <p className="mt-2 text-gray-600">
        PNR: <span className="font-semibold text-purple-900">{booking.pnr}</span>
      </p>

      {/* Booking Details Card */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-purple-50 p-6 rounded-xl shadow-inner">
        <div>
          <p className="text-sm font-semibold text-purple-700">Passenger</p>
          <p className="text-purple-900 font-medium">{booking.passenger_name}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-purple-700">Email</p>
          <p className="text-purple-900 font-medium">{booking.passenger_email}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-purple-700">Route</p>
          <p className="text-purple-900 font-medium">
            {booking.flight_details.departure_city} → {booking.flight_details.arrival_city}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-purple-700">Amount Paid</p>
          <p className="text-purple-900 font-bold">₹{booking.final_price}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <a
          href={`${API_BASE}/api/bookings/ticket/${booking.pnr}`}
          className="btn-primary w-full sm:w-auto text-center py-2 px-6"
        >
          Download Ticket
        </a>

        <Link
          to="/history"
          className="btn-secondary w-full sm:w-auto text-center py-2 px-6"
        >
          View Bookings
        </Link>
      </div>
    </div>
  );
}
