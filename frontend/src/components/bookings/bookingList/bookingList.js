import React from 'react';
import './bookingList.css';

const bookingList = props => (
  <ul className="booking-list">
    {props.bookings.map(booking => { 
      return (
        <li key={booking.id} className="booking-item">
          <div className="booking-data">
            {booking.event.title} - 
            {new Date(booking.createdAt).toLocaleDateString()}
          </div>
          <div className="booking-actions">
            <button className="btn light text" onClick={props.onCancelBooking.bind(this, booking.id)}>Cancel</button>
          </div>
        </li>
      );
      })}
  </ul>
);

export default bookingList;