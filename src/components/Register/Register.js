import React, { Component } from 'react';
import './Register.css';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import axios from "../../base.js";
import Qs from 'qs';

class Register extends Component {

    constructor(props) {
        super(props);

        this.emailRef = React.createRef();
        this.usernameRef = React.createRef();
        this.genderRef = React.createRef();
        this.passwordRef = React.createRef();
    }

    handleSubmit = event => {
        event.preventDefault();

        const email = this.emailRef.current.value;
        const username = this.usernameRef.current.value;
        const gender = this.genderRef.current.value;
        const password = this.passwordRef.current.value;

        axios.post(`/user/signup`, 
                Qs.stringify({ 
                    email,
                    username,
                    gender,
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
              <h3 className="formHeader">SignUp</h3>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input required type="text" className="form-control" id="username" ref={this.usernameRef} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input required type="email" className="form-control" id="email" ref={this.emailRef} />
                </div>
                <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select className="form-control" id="gender" ref={this.genderRef}>
                        <option value="0">Female</option>
                        <option value="1">Male</option>
                    </select>
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input required type="password" className="form-control" id="password" ref={this.passwordRef}/>
                </div>
                <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                <button className="login-btn btn btn-primary btn-block" onClick={() => {this.props.history.push(`/login`)}}>Log In</button>
              </form>
            </div>
          </div>

        </ReactCSSTransitionGroup>
      );
    }
}

export default Register;