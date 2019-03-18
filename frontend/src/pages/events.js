import React, { Component } from 'react';
import Modal from './../components/modal/modal';
import Backdrop from './../components/backdrop/backdrop';
import './events.css';

class EventsPage extends Component {
  state = {
    modalIsOpen: false
  };

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
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
    const price = this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (title.trim().length === 0
      ||price.trim().length === 0
      || date.trim().length === 0
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
              <input type="number" id="price" ref={this.priceElRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={this.dateElRef}></input>
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