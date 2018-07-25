import React, { Component } from 'react';
import './Login.css';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import axios from "../../base.js";
import Qs from 'qs';

class Login extends Component {

    constructor(props) {
        super(props);

        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
    }

    handleSubmit = event => {
        event.preventDefault();

        const email = this.emailRef.current.value;
        const password = this.passwordRef.current.value;

        const username = email;

        axios.post(`/user/login`, 
                Qs.stringify({ 
                    // email,
                    username,
                    password
                }),
        )
        .then(res => {
            console.log(res.data);
            if(res.data.status === 0) {
                localStorage.setItem('Email', email);
                localStorage.setItem('Password', password);
                this.props.history.push(`/`);
            } else {
                alert(res.data.msg);
            }
        })
    }

    render() {
      return (
        <ReactCSSTransitionGroup
            transitionName="AppearTransition"
            transitionAppear={ true }
            transitionAppearTimeout={ 1000 }
            transitionEnter={ false }
            transitionLeave={ false }
        >

          <div className="container">
            <div className="formDiv">
              <h3 className="formHeader">LogIn</h3>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input required type="email" className="form-control" id="email" ref={this.emailRef} aria-describedby="emailHelp" />
                  <small id="emailHelp" className="form-text text-muted">You can use your HelloGWU account to login.</small>
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input required type="password" className="form-control" id="password" ref={this.passwordRef}/>
                </div>
                <button type="submit" className="btn btn-primary btn-block">Log In</button>
                <button className="signup-btn btn btn-primary btn-block" onClick={() => {this.props.history.push(`/register`)}}>Sign Up</button>
              </form>
            </div>
          </div>

        </ReactCSSTransitionGroup>
      );
    }
}

export default Login;