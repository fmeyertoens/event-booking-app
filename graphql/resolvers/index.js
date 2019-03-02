const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

const user = async userId => {
  try {
    const user = await User.findById(userId)

    return {
      ...user._doc,
      id: user.id,
      password: null,
      createdEvents: events(user._doc.createdEvents)
    };
  } catch (error) {
    throw error;
  }
};

const events = async eventIds => {
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
        creator: user(event._doc.creator) // why not event._doc.creator
      }
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return {
          ...event._doc,
          id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user(event._doc.creator)
        };
      });
    } catch (err) {
      throw err;
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
        creator: user(savedEvent._doc.creator)
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
  }
};