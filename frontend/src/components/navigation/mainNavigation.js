import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from './../../context/auth-context';
import './mainNavigation.css';

const mainNavigation = props => (
  <AuthContext.Consumer>
    {(context) => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>EagleEvents <span role="img" aria-label="eagle">🦅</span></h1>
          </div>
          <div className="main-navigation__items">
            <ul>
              {!context.token &&
              <li><NavLink to="/auth">Login</NavLink></li>}
              <li><NavLink to="/events">Events</NavLink></li>
              {context.token &&
              <React.Fragment>
                <li><NavLink to="/bookings">Bookings</NavLink></li>
                <li><button onClick={context.logout}>Logout</button></li>
              </React.Fragment>}
            </ul>
          </div>
        </header>
      )
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;