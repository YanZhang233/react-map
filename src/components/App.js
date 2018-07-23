import React, { Component } from 'react';
import './App.css';
import Map from './Map/Map.js';

class App extends Component {

    constructor(props) {
        super(props);
    }

  render() {
    return (
        <div>
          <Map />
        </div>
    );
  }
}

export default App;
