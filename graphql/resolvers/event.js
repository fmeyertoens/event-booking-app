const {
  dateToString
} = require('../../helpers/date');
const User = require('../../models/user');
const Event = require('../../models/event');
const {
  createReturnEventObject
} = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return createReturnEventObject(event);
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
        creator: '5c87d1729184753d2cdfa430'
      });
      const savedEvent = await event.save();

      const creator = await User.findById('5c87d1729184753d2cdfa430');

      if (!creator) {
        throw new Error('Creator not found.');
      }
      creator.createdEvents.push(event); // mongoose extracts the event id automatically
      await creator.save();

      return createReturnEventObject(savedEvent);
    } catch (error) {
      throw error;
    }
  }
};