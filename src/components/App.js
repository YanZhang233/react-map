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

      // this.login(email, password);
      this.loginWithCookie();

      // if(email !== null && password !== null) {
      //     this.login(email, password);
      // } else {
      //     this.loginWithCookie();
      // }

    }

    login = (email, password) => {
        const username = email;

        console.log(username);
        console.log(password);

        axios.post(`/user/login`, 
                Qs.stringify({ 
                    username,
                    // email,
                    password
                }),
        )
        .then(res => {
            console.log(res.data);
            if(res.data.status === 0) {
              // this.setState({uid: })
            } else {
                alert(res.data.msg);
            }
        })
    }

    loginWithCookie = () => {
      axios.post(`/user/login`
      )
      .then(res => {
          console.log(res.data);
          if(res.data.status === 0) {
            // this.setState({ uid: userId, role: userRole });
          }
      })
    }

    render() {
      return (
          <div>
            <Map 
              uid={this.state.uid}
            />
          </div>
      );
    }
}

export default App;
