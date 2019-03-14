const Booking = require('../../models/booking');
const Event = require('../../models/event');

const {
  createReturnBookingObject,
  createReturnEventObject
} = require('./merge');

module.exports = {
  bookings: async (args, req) => {
    try {
      if (!req.isAuthorized) {
        throw new Error('Unauthenticated');
      }
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return createReturnBookingObject(booking);
      });
    } catch (error) {
      throw error;
    }
  },
  bookEvent: async (args, req) => {
    try {
      if (!req.isAuthorized) {
        throw new Error('Unauthenticated');
      }
      const event = await Event.findById(args.eventId);
      if (!event) {
        throw new Error('Event does not exist.');
      }
      const bookingData = new Booking({
        user: req.userId,
        event: event
      });
      const booking = await bookingData.save();
      return createReturnBookingObject(booking);

    } catch (error) {
      throw error;
    }
  },
  cancelBooking: async (args, req) => {
    try {
      if (!req.isAuthorized) {
        throw new Error('Unauthenticated');
      }
      const booking = await Booking.findByIdAndDelete(args.bookingId).populate('event');
      return createReturnEventObject(booking.event);
    } catch (error) {
      throw error;
    }
  }
};