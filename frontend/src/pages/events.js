import React, { Component } from 'react';
import Modal from './../components/modal/modal';
import Backdrop from './../components/backdrop/backdrop';
import Datetime from 'react-datetime';
import AuthContext from '../context/auth-context';
import moment from 'moment';
import EventList from './../components/Events/EventList/eventList';
import Spinner from './../components/Spinner/spinner';
import './events.css';
import 'react-datetime/css/react-datetime.css';

class EventsPage extends Component {
  state = {
    createModalIsOpen: false,
    eventDate: null,
    events: [],
    isLoading: false,
    selectedEvent: null
  };

  isActive = true;

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  updateEventDate = (newDate) => {
    if ("string" === typeof newDate) {
      newDate = moment(newDate);
    }
    if (newDate.isValid()) {
      this.setState({eventDate: newDate.toDate()});
    }
  }

  openModal = () => {
    this.setState({createModalIsOpen: true});
  }

  closeModal = () => {
    this.setState({createModalIsOpen: false, selectedEvent: null});
  }

  confirmModal = async () => {
    this.setState({createModalIsOpen: false});
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.state.eventDate ? this.state.eventDate.toISOString() : this.state.eventDate;
    const description = this.descriptionElRef.current.value;

    if (title.trim().length === 0
      || price < 0
      || !date
      || description.trim().length === 0) {
      return;
    }

    const requestBody = {
      query: `
        mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
          createEvent(eventInput: {
            title: $title,
            description: $desc,
            price: $price,
            date: $date
          }) {
            id
            title
            price
            description
            price
            date
          }
        }
      `,
      variables: {
        title: title,
        desc: description,
        price: price,
        date: date
      }
    };

    const token = this.context.token;

    try {
      const response = await fetch('http://localhost:8000/api', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
      if (!response.ok) {
        throw new Error('Failed');
      }
      const resData = await response.json();
      
      this.setState(prevState => {
        return { events: [
          ...prevState.events,
          {
            ...resData.data.createEvent,
            creator: {
              id: this.context.userId
            }
          }]};
      });
    } catch (error) {
      console.log(error);
    }
  }

  bookEvent = async () => {
    if (!this.context.token) {
      this.setState({selectedEvent: null});
      return;
    }
    const requestBody = {
      query: `
        mutation BookEvent($id: ID!) {
          bookEvent(eventId: $id) {
            id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        id: this.state.selectedEvent.id
      }
    };

    const token = this.context.token;

    try {
      const response = await fetch('http://localhost:8000/api', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
      if (!response.ok) {
        throw new Error('Failed');
      }
      const resData = await response.json();
      
      // console.log(resData);
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({selectedEvent: null});
    }
  }

  componentDidMount() {
    this.fetchEvents();
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  async fetchEvents() {
    this.setState({isLoading: true});
    const requestBody = {
      query: `
        query {
          events {
            id
            title
            price
            description
            price
            date
            creator {
              id
              email
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
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed');
      }
      const resData = await response.json();
      
      const events = resData.data.events;
      if (this.isActive) {
        this.setState({events: events});
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (this.isActive) {
        this.setState({isLoading: false});
      }
    }
  }

  showDetailModal = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e.id === eventId);
      
      return {selectedEvent: selectedEvent};
    });
  }

  render() {

    return (
      <React.Fragment>
        {(this.state.createModalIsOpen || this.state.selectedEvent) && <Backdrop />}
        {this.state.createModalIsOpen && <Modal title="Add Event"
        canCancel
        canConfirm
        onCancel={this.closeModal}
        onConfirm={this.confirmModal}
        confirmText="Confirm">
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={this.titleElRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" step="0.01" ref={this.priceElRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <Datetime inputProps={{className: 'datetime'}} onChange={this.updateEventDate}/>
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea id="description" rows="4" ref={this.descriptionElRef}></textarea>
            </div>
          </form>
        </Modal>}
        {this.state.selectedEvent && <Modal
          title={this.state.selectedEvent.title}
          canCancel
          canConfirm
          onCancel={this.closeModal}
          onConfirm={this.bookEvent}
          confirmText={this.context.token ? 'Book': 'Confirm'}>
            <h2>{this.state.selectedEvent.price} € - {new Date(this.state.selectedEvent.date).toLocaleDateString('de-DE')} - {new Date(this.state.selectedEvent.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}</h2>
            <p>{this.state.selectedEvent.description}</p>
        </Modal>}
        {this.context.token && (
        <div className="events-panel">
          <p>Any events coming up?</p>
          <button className="btn" onClick={this.openModal}>Create one</button>
        </div>
        )}
        {this.state.isLoading ?
          <Spinner /> :
          (this.state.events.length > 0 ?
          <EventList events={this.state.events} onViewDetail={this.showDetailModal}/>:
          <p className="events-panel">There seem to be no events so far.</p>)
        }
      </React.Fragment>
      );
  }
}

export default EventsPage;