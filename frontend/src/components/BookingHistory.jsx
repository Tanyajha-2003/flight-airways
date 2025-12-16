// import React from 'react';
// import { FiCalendar, FiDownload, FiMapPin } from 'react-icons/fi';
// import { format } from 'date-fns';

// const Detail = ({ label, value }) => (
//   <div>
//     <span className="text-purple-400 text-xs uppercase">{label}</span>
//     <div className="text-white font-semibold">{value}</div>
//   </div>
// );

// const BookingHistory = ({ bookings }) => {
//   return (
//     <div className="max-w-6xl mx-auto fade-in px-4">

//       <h1 className="text-3xl font-bold text-purple-200 mb-10 flex items-center gap-3">
//         <FiCalendar className="text-purple-400" />
//         Booking History
//       </h1>

//       {bookings.length === 0 ? (
//         <div className="card text-center py-16">
//           <div className="text-6xl mb-4">✈️</div>
//           <h3 className="text-xl font-bold text-purple-300">
//             No Bookings Yet
//           </h3>
//           <p className="text-purple-400">
//             Start your journey by booking your first flight
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-8">
//           {bookings.map((booking) => (
//             <div
//               key={booking._id}
//               className="flight-history-card"
//             >
//               <div className="flex flex-col lg:flex-row gap-8 justify-between">

//                 {/* LEFT */}
//                 <div className="flex-1 space-y-6">
//                   {/* Header */}
//                   <div className="flex flex-wrap items-center gap-4">
//                     <div className="pnr-box">
//                       <span className="pnr-label">PNR</span>
//                       <span className="pnr-value">{booking.pnr}</span>
//                     </div>

//                     <div className="meta-chip">
//                       <span>Date</span>
//                       <strong>
//                         {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
//                       </strong>
//                     </div>

//                     <span className={`status-pill ${booking.status}`}>
//                       {booking.status}
//                     </span>
//                   </div>

//                   {/* Route */}
//                   <div className="route-line">
//                     <FiMapPin />
//                     <span>
//                       {booking.flight_details.departure_city}
//                       <span className="arrow">→</span>
//                       {booking.flight_details.arrival_city}
//                     </span>
//                   </div>

//                   {/* Details */}
//                   <div className="detail-grid">
//                     <Detail
//                       label="Airline"
//                       value={booking.flight_details.airline}
//                     />
//                     <Detail
//                       label="Passenger"
//                       value={booking.passenger_name}
//                     />
//                     <Detail
//                       label="Travel Date"
//                       value={format(
//                         new Date(booking.flight_details.departure_time),
//                         'MMM dd, yyyy'
//                       )}
//                     />
//                   </div>
//                 </div>

//                 {/* RIGHT */}
//                 <div className="price-box">
//                   <div className="price">
//                     ₹{booking.final_price}
//                   </div>

//                   {booking.base_price !== booking.final_price && (
//                     <div className="old-price">
//                       ₹{booking.base_price}
//                     </div>
//                   )}

//                   <span className="price-label">Final Amount</span>

//                   <a
//                     href={`http://localhost:5001/api/bookings/ticket/${booking.pnr}`}
//                     className="download-btn"
//                   >
//                     <FiDownload />
//                     Download Ticket
//                   </a>
//                 </div>

//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingHistory;
import React from 'react';
import { FiCalendar, FiDownload, FiMapPin } from 'react-icons/fi';
import { format } from 'date-fns';

// Use environment variable
const API_BASE = process.env.REACT_APP_API_BASE;

const Detail = ({ label, value }) => (
  <div>
    <span className="text-purple-400 text-xs uppercase">{label}</span>
    <div className="text-white font-semibold">{value}</div>
  </div>
);

const BookingHistory = ({ bookings }) => {
  return (
    <div className="max-w-6xl mx-auto fade-in px-4">
      <h1 className="text-3xl font-bold text-purple-200 mb-10 flex items-center gap-3">
        <FiCalendar className="text-purple-400" />
        Booking History
      </h1>

      {bookings.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-6xl mb-4">✈️</div>
          <h3 className="text-xl font-bold text-purple-300">No Bookings Yet</h3>
          <p className="text-purple-400">Start your journey by booking your first flight</p>
        </div>
      ) : (
        <div className="space-y-8">
          {bookings.map((booking) => (
            <div key={booking._id} className="flight-history-card">
              <div className="flex flex-col lg:flex-row gap-8 justify-between">

                {/* LEFT */}
                <div className="flex-1 space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="pnr-box">
                      <span className="pnr-label">PNR</span>
                      <span className="pnr-value">{booking.pnr}</span>
                    </div>

                    <div className="meta-chip">
                      <span>Date</span>
                      <strong>{format(new Date(booking.booking_date), 'MMM dd, yyyy')}</strong>
                    </div>

                    <span className={`status-pill ${booking.status}`}>{booking.status}</span>
                  </div>

                  <div className="route-line">
                    <FiMapPin />
                    <span>
                      {booking.flight_details.departure_city}
                      <span className="arrow">→</span>
                      {booking.flight_details.arrival_city}
                    </span>
                  </div>

                  <div className="detail-grid">
                    <Detail label="Airline" value={booking.flight_details.airline} />
                    <Detail label="Passenger" value={booking.passenger_name} />
                    <Detail
                      label="Travel Date"
                      value={format(new Date(booking.flight_details.departure_time), 'MMM dd, yyyy')}
                    />
                  </div>
                </div>

                {/* RIGHT */}
                <div className="price-box">
                  <div className="price">₹{booking.final_price}</div>
                  {booking.base_price !== booking.final_price && (
                    <div className="old-price">₹{booking.base_price}</div>
                  )}
                  <span className="price-label">Final Amount</span>

                  {/* Use API_BASE from env */}
                  <a
                    href={`${API_BASE}/bookings/ticket/${booking.pnr}`}
                    className="download-btn"
                  >
                    <FiDownload />
                    Download Ticket
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
