import * as React from 'react';
import { Navbar } from '../components/navbar';
import { Link } from 'react-router';
import { login, register } from '../actions/auth_actions';
const AFTER_LOGIN = '/dashboard';

export class Login extends React.Component<any, any> {
  // I *THINK* this is an anti-pattern in Redux. Peer review requested.
  // Somewhat conflicted because this form handles passwords, and I don't want
  // to persist them in the state tree.
  set(name) {
    return function(event){
      let state = {}
      state[name] = event.target.value;
      this.setState(state);
    };
  }

  submitLogin(e) {
    e.preventDefault();
    let password = (this.state || {}).loginPassword;
    let email = (this.state || {}).loginEmail;
    return this.props.dispatch(login(email, password));
  }

  submitRegistration(e) {
    e.preventDefault();
    let state = this.state || {};

    let name = state.regName;
    let email = state.regEmail;
    let password = state.regPass;
    let confirmation = state.regConfirmation;

    return this.props.dispatch(register(name, email, password, confirmation));
  }

  render() {

    return (
      <div>
        <Navbar/>
        <div className="all-content-wrapper">
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
              <div className="widget-wrapper">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="widget-header">
                      <h5>Login</h5>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <form onSubmit={ this.submitLogin.bind(this) } >
                    <div className="col-sm-12">
                      <div className="widget-content">
                        <div className="input-group">
                          <label>Email</label>
                          <input type="text"  onChange={ this.set("loginEmail").bind(this) }></input>
                          <label>Password</label>
                          <input type="password" onChange={ this.set("loginPassword").bind(this) }></input>
                        </div>
                        <div className="row">
                          <div className="col-xs-6">
                            <p className="auth-link">
                              <Link to={ "route_for_resetting_password" }>Reset password</Link>
                            </p>
                          </div>
                          <div className="col-xs-6">
                            <button className="button-like button green login">
                              Login
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
              <div className="widget-wrapper">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="widget-header">
                      <h5>Create an Account</h5>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <form onSubmit={ this.submitRegistration.bind(this) } >
                      <div className="widget-content">
                        <div className="input-group">
                          <label>Email</label>
                          <input type="email" onChange={ this.set("regEmail").bind(this) } ></input>
                          <label>Name</label>
                          <input type="text" onChange={ this.set("regName").bind(this) }></input>
                          <label>Password</label>
                          <input type="password" onChange={ this.set("regPass").bind(this) }></input>
                          <label>Verfy Password</label>
                          <input type="password" onChange={ this.set("regConfirmation").bind(this) }></input>
                        </div>
                        <div className="row">
                          <div className="col-xs-6">
                          </div>
                          <div className="col-xs-6">
                            <div className="auth-button">
                              <button className="button-like button green create-account">
                                Create Account
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
