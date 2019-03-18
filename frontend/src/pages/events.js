import React, { Component } from 'react';
import Modal from './../components/modal/modal';
import Backdrop from './../components/backdrop/backdrop';
import Datetime from 'react-datetime';
import './events.css';
import 'react-datetime/css/react-datetime.css';

class EventsPage extends Component {
  state = {
    modalIsOpen: false,
    eventDate: null
  };

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  updateEventDate = (newDate) => {
    this.setState({eventDate: newDate.toDate()});
  }

  openModal = () => {
    this.setState({modalIsOpen: true});
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }

  confirmModal = () => {
    this.setState({modalIsOpen: false});
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.state.eventDate.toISOString();
    const description = this.descriptionElRef.current.value;

    if (title.trim().length === 0
      || this.priceElRef.current.value.trim().length === 0
      || !date
      || description.trim().length === 0) {
      return;
    }

    const event = {title, price, date, description};
    console.log(event);
  }

  render() {
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
        <div className="events-panel">
          <p>Any events coming up?</p>
          <button className="btn" onClick={this.openModal}>Create one</button>
        </div>
      </React.Fragment>
      );
  }
}

export default EventsPage;