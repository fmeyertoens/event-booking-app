const Event = require('../../models/event');
const User = require('../../models/user');
const DataLoader = require('dataloader');
const {
  dateToString
} = require('../../helpers/date');

const eventLoader = new DataLoader(eventIds => {
  return getEvents(eventIds);
});

const userLoader = new DataLoader(userIds => {
  return User.find({_id: {$in: userIds}});
});

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
    // convert userId to string so the loader can find duplicates
    const user = await userLoader.load(userId.toString());

    return {
      ...user._doc,
      id: user.id,
      password: null,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents.map(e => e.toString()))
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
    // the events must be returned to the dataloader in the order of the eventIds array
    events.sort((a, b) => {
      return eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString());
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
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (error) {
    throw error;
  }
};

exports.createReturnBookingObject = createReturnBookingObject;
exports.createReturnEventObject = createReturnEventObject;