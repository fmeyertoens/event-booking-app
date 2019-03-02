const {
  buildSchema
} = require("graphql");

module.exports = buildSchema(`
  type Booking {
    id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type Event {
    id: ID!
    title: String!
    description: String!
    price: Float!
    date: String
    creator: User!
  }
  
  input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  type User {
    id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
  }

  input UserInput {
    email: String!
    password: String!
  }

  type RootQuery {
    events: [Event!]!
    bookings: [Booking!]!
  }

  type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking
    cancelBooking(bookingId: ID!): Event!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);