import React, { Component } from 'react';
import AddEvent from './AddEvent/AddEvent.js';

class Event extends Component {
  render() {
    return (
        <AddEvent 
            map={this.props.map}
            changeCenter={this.props.changeCenter}
            toggleEvent={this.props.toggleEvent}
            defaultEventPlace={this.props.defaultEventPlace}
        />
    );
  }
}

export default Event;