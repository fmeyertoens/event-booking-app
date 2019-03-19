import React, { Component } from 'react';
import Modal from './../components/modal/modal';
import Backdrop from './../components/backdrop/backdrop';
import Datetime from 'react-datetime';
import AuthContext from '../context/auth-context';
import moment from 'moment';
import './events.css';
import 'react-datetime/css/react-datetime.css';

class EventsPage extends Component {
  state = {
    modalIsOpen: false,
    eventDate: null,
    events: []
  };

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
    this.setState({modalIsOpen: true});
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }

  confirmModal = async () => {
    this.setState({modalIsOpen: false});
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.state.eventDate ? this.state.eventDate.toISOString() : this.state.eventDate;
    const description = this.descriptionElRef.current.value;

    if (title.trim().length === 0
      || price <= 0
      || !date
      || description.trim().length === 0) {
      return;
    }

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {
            title: "${title}",
            description: "${description}",
            price: ${price},
            date: "${date}"
          }) {
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
      
      this.fetchEvents();
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.fetchEvents();
  }

  async fetchEvents() {
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
      this.setState({events: events});
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const eventList = this.state.events.map(event => {
      return <li key= {event.id} className="event-list-item">{event.title}</li>
    });

    return (
      <React.Fragment>
        {this.state.modalIsOpen && <Backdrop />}
        {this.state.modalIsOpen && <Modal title="Add Event"
        canCancel
        canConfirm
        onCancel={this.closeModal}
        onConfirm={this.confirmModal}>
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
        {this.context.token && (
        <div className="events-panel">
          <p>Any events coming up?</p>
          <button className="btn" onClick={this.openModal}>Create one</button>
        </div>
        )}
        <ul className="event-list">
          {eventList}
        </ul>
      </React.Fragment>
      );
  }
}

export default EventsPage;