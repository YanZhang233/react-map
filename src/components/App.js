import React, { Component } from 'react';
import './App.css';
import Map from './Map/Map.js';
import axios from "../base.js";
import Qs from 'qs';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null
        };
    }

    componentWillMount() {
        
      const email = localStorage.getItem('Email');
      const password = localStorage.getItem('Password');

      if(email !== null && password !== null) {
          this.login(email, password);
      } else {
          this.loginWithCookie();
      }

    }

    login = (email, password) => {

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
              this.setState({user: res.data.data})
            } else {
              console.log(res.data.msg);
            }
        })
    }

    loginWithCookie = () => {
      axios.post(`/user/login`
      )
      .then(res => {
          console.log(res.data);
          if(res.data.status === 0) {
            this.setState({user: res.data.data});
          }
      })
    }

    logout = (event) => {      
        console.log("user_logout", this.state.user);
        axios.get(`/user/logout`
        )
        .then(res => {
            if(res.data.status === 0) {
                this.setState({ user: null });
                localStorage.clear();
            } else {
                alert(res.data.msg);
            }
        })
    }

    render() {
      return (
          <div>
            <Map 
              user={this.state.user}
              logout={this.logout}
            />
          </div>
      );
    }
}

export default App;
