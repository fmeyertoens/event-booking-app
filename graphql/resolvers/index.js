const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

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
      return {
        ...event._doc,
        id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: getUser.bind(this, event._doc.creator)
      }
    });
  } catch (err) {
    throw err;
  }
};

const getEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      id: event.id,
      date: new Date(event._doc.date).toISOString(),
      creator: getUser.bind(this, event._doc.creator)
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return {
          ...event._doc,
          id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: getUser.bind(this, event._doc.creator)
        };
      });
    } catch (err) {
      throw err;
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return {
          ...booking._doc,
          id: booking.id,
          user: getUser.bind(this, booking._doc.user),
          event: getEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        }
      });
    } catch (error) {
      throw error;
    }
  },
  createEvent: async args => {
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: '5c3a19ba80e4ec2e30f2e669'
      });
      const savedEvent = await event.save();

      const creator = await User.findById('5c3a19ba80e4ec2e30f2e669');

      if (!creator) {
        throw new Error('Creator not found.');
      }
      creator.createdEvents.push(event); // mongoose extracts the event id automatically
      await creator.save();

      return {
        ...savedEvent._doc,
        id: savedEvent._doc._id.toString(), // = event.id
        date: new Date(savedEvent._doc.date).toISOString(),
        creator: getUser.bind(this, savedEvent._doc.creator)
      };
    } catch (error) {
      throw error;
    }
  },
  createUser: async args => {
    try {
      const existingUser = await User.findOne({
        email: args.userInput.email
      });
      if (existingUser) {
        throw new Error('User already exists!');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const newUser = new User({
        email: args.userInput.email,
        password: hashedPassword
      });
      const result = await newUser.save();
      return {
        ...result._doc,
        password: null,
        id: result.id
      };
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async args => {
    try {
      const event = await Event.findById(args.eventId);
      if (!event) {
        throw new Error('Event does not exist.');
      }
      const bookingData = new Booking({
        user: '5c3a19ba80e4ec2e30f2e669',
        event: event
      });
      const booking = await bookingData.save();
      return {
        ...booking._doc,
        id: booking.id,
        user: getUser.bind(this, booking._doc.user),
        event: getEvent.bind(this, booking._doc.event),
        createdAt: new Date(booking._doc.createdAt).toISOString(),
        updatedAt: new Date(booking._doc.updatedAt).toISOString(),
      };

    } catch (error) {
      throw error;
    }
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findByIdAndDelete(args.bookingId).populate('event');
      const event = {
        ...booking.event._doc,
        id: booking.event.id,
        creator: getUser.bind(this, booking.event._doc.creator)
      };
      return event;
    } catch (error) {
      throw error;
    }
  }
};