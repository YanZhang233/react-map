import React, { Component } from 'react';
import AddEvent from './AddEvent/AddEvent.js';
import DisplayEvent from './DisplayEvent/DisplayEvent.js';
import EditEvent from './EditEvent/EditEvent.js';

class Event extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            event: null
        }
    }

    editEvent = (event) => {
        this.setState({event: event});
    }

    backToUser = () => {
        this.setState({event: null});
    }

  render() {
    if(this.props.publish === true) {
        return (
            <AddEvent 
                map={this.props.map}
                changeCenter={this.props.changeCenter}
                toggleEvent={this.props.toggleEvent}
                defaultEventPlace={this.props.defaultEventPlace}
            />
        );
    }
    if(this.props.userEvent === true && this.props.user !== null) {
        if(this.state.event !== null) {
            return (
                <EditEvent 
                    map={this.props.map}
                    changeCenter={this.props.changeCenter}
                    event={this.state.event} 
                    toggleUser={this.props.toggleUser}
                    backToUser={this.backToUser}
                />
            );
        }
        return (
            <DisplayEvent 
                toggleUser={this.toggleUser}
                user={this.props.user}
                editEvent={this.editEvent}
            />
        );
    }
    return null;
  }
}

export default Event;