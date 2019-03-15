import React, { Component } from 'react';
import './auth.css';

class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  submitHandler = () => {
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;


  };

  render() {
    return (
    <form className="auth-form">
      <div className="form-control">
        <label htmlFor="email">E-Mail</label>
        <input type="email" id="email" ref={this.emailEl}/>
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={this.passwordEl}/>
      </div>
      <div className="form-actions">
        <button type="button" className="secondary">Signup</button>
        <button type="Submit">Login</button>
      </div>
    </form>);
  }
}

export default AuthPage;