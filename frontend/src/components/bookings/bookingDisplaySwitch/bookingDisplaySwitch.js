import React from 'react';
import './bookingDisplaySwitch.css';

const bookingDisplaySwitch = props => {
  return (
  <div className="display-switch">
    <button className={(props.activeView === 'list' ? 'active' : '') + " btn light"} onClick={props.onSwitch.bind(this, 'list')}>List</button>
    <button className={(props.activeView === 'chart' ? 'active' : '') + " btn light"}  onClick={props.onSwitch.bind(this, 'chart')}>Chart</button>
  </div>);
};

export default bookingDisplaySwitch;