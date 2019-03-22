import React, { Component } from 'react';
import AuthContext from './../context/auth-context';
import Spinner from './../components/Spinner/spinner';
import BookingList from './../components/bookings/bookingList/bookingList';
import './booking.css';

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: []
  }

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = async () => {
    this.setState({isLoading: true});
    const requestBody = {
      query: `
        query {
          bookings {
            id
            createdAt
            event {
              id
              title
              date
            }
          }
        }
      `
    };

    try {
      const response = await fetch('http://localhost:8000/api', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.context.token
        }
      });
      if (!response.ok) {
        throw new Error('Failed');
      }
      const resData = await response.json();
      
      const bookings = resData.data.bookings;
      this.setState({bookings: bookings});
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({isLoading: false});
    }
  }

  cancelBooking = async (bookingId) => {
    this.setState({isLoading: true});
    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            id
            title
          }
        }
      `,
      variables: {
        id: bookingId
      }
    };

    try {
      const response = await fetch('http://localhost:8000/api', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.context.token
        }
      });
      if (!response.ok) {
        throw new Error('Failed');
      }
      // const resData = await response.json();
      
      this.setState(prevState => {
        return {
          bookings: prevState.bookings.filter(booking => {
              return booking.id !== bookingId;
          })
        };
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({isLoading: false});
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? <Spinner /> :
        (this.state.bookings.length > 0 ?
          <BookingList bookings={this.state.bookings} onCancelBooking={this.cancelBooking}/>:
          <p className="message-panel">There seem to be no bookings so far.</p>
        )}
      </React.Fragment>
    )
  }
}

export default BookingsPage;