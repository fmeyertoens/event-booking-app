const user = require('./user');
const event = require('./event');
const booking = require('./booking');

const rootResolver = {
  ...user,
  ...event,
  ...booking
};

module.exports = rootResolver;