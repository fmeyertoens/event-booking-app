const Event = require('../../models/event');
const User = require('../../models/user');

const {
  dateToString
} = require('../../helpers/date');

const createReturnEventObject = event => {
  return {
    ...event._doc,
    id: event.id,
    date: dateToString(event._doc.date),
    creator: getUser.bind(this, event._doc.creator)
  }
};

const createReturnBookingObject = booking => {
  return {
    ...booking._doc,
    id: booking.id,
    user: getUser.bind(this, booking._doc.user),
    event: getEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  }
};

const getUser = async userId => {
  try {
    const user = await User.findById(userId)

    return {
      ...user._doc,
      id: user.id,
      password: null,
      createdEvents: getEvents.bind(this, user._doc.createdEvents) // bind creates a copy of the function that is only executed when needed; executing the functions directly causes an infinite loop
    };
  } catch (error) {
    throw error;
  }
};

const getEvents = async eventIds => {
  try {
    const events = await Event.find({
      _id: {
        $in: eventIds
      }
    });
    return events.map(event => {
      return createReturnEventObject(event);
    });
  } catch (err) {
    throw err;
  }
};

const getEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return createReturnEventObject(event);
  } catch (error) {
    throw error;
  }
};

exports.createReturnBookingObject = createReturnBookingObject;
exports.createReturnEventObject = createReturnEventObject;