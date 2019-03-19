import React, { Component } from 'react';
import AuthContext from './../../../../context/auth-context';
import './eventListItem.css';

class eventItem extends Component {
  state = {
    authenticatedUser: this.context.userId
  };

  static contextType = AuthContext;

  render() {
    return (
    <li className="event-list-item">
      <div>
        <h1>{this.props.event.title}</h1>
        <h2>{this.props.event.price} € - {new Date(this.props.event.date).toLocaleDateString('de-DE')}</h2>
      </div>
      <div>
        {this.context.userId === this.props.event.creator.id ?
          <p>This is your event</p> :
          <button className="btn light text">Show Details</button>}
      </div>
    </li>
    );
  } 
}

export default eventItem;