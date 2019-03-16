import React, { Component } from 'react';
import Modal from './../components/modal/modal';
import Backdrop from './../components/backdrop/backdrop';
import './events.css';

class EventsPage extends Component {
  state = {
    modalIsOpen: false
  };

  openModal = () => {
    this.setState({modalIsOpen: true});
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }

  render() {
    return (
      <React.Fragment>
        {this.state.modalIsOpen && <Backdrop />}
        {this.state.modalIsOpen && <Modal title="Add Event"
        canCancel
        canConfirm
        onCancel={this.closeModal}
        onConfirm={this.closeModal}>
          <p>Modal Content</p>
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