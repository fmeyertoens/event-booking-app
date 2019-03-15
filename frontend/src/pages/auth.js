import React, { Component } from 'react';
import AuthContext from './../context/auth-context';
import './auth.css';

class AuthPage extends Component {
  state = {
    showLogin: true,
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchMode = () => {
    this.setState(prevState => {
      return {showLogin: !prevState.showLogin};
    });
  };

  submitHandler = async (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if(email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    if (!this.state.showLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {
              email: "${email}",
              password: "${password}"
            }) {
              id
              email
            }
          }
        `
      };
    }

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
      if(resData.data.login.token) {
        this.context.login(
          resData.data.login.token,
          resData.data.login.token,
          resData.data.login.token);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
    <form className="auth-form" onSubmit={this.submitHandler}>
      <div className="form-control">
        <label htmlFor="email">E-Mail</label>
        <input type="email" id="email" ref={this.emailEl}/>
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={this.passwordEl}/>
      </div>
      <div className="form-actions">
        <button type="button" className="secondary" onClick={this.switchMode}>Switch to {this.state.showLogin ? 'Signup': 'Login'}</button>
        <button type="Submit">{this.state.showLogin ? 'Login': 'Signup'}</button>
      </div>
    </form>);
  }
}

export default AuthPage;