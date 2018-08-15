import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import './DisplayEvent.css';
import axios from "../../base.js";
import defaultAvatar from '../../images/defaultAvatar.png';

class DisplayEvent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userEvents: [],
            userAvatar: defaultAvatar
        };
    }

    componentDidMount() {
        // console.log("user", this.props.user);
        if(this.props.user.avatar !== null) {
            this.setState({userAvatar: this.props.user.avatar});
        }
        axios.get(`/event/my`
        )
        .then(res => {
            console.log("userEvents", res.data);
            if(res.data.status === 0) {
                this.setState({userEvents: res.data.data});
            } else if(res.data.status === 10) {
                this.props.history.push(`/login`);
            } else {
                alert(res.data.msg);
            }
        })
    }


  render() {
    if(this.props.user !== null) {
        return (
            <div className="container user-cta">
                <div className="events">
                    <div className="user-info">
                        <div className="avatar">
                            <img src={this.state.userAvatar} />
                        </div>
                        {this.props.user.gender === 0 ?
                            <i className="fas fa-venus"></i>
                            :
                            <i className="fas fa-mars"></i>
                        }
                        {` ` + this.props.user.username}
                        <span className="email">
                            <i className="fas fa-envelope"></i> {this.props.user.email}
                        </span>
                    </div>
                    <div className="events-list">
                        {this.state.userEvents.length > 0 ?
                            Object.keys(this.state.userEvents).map(key => (
                                <div 
                                    className="list-group"
                                    key={key}
                                >
                                  <button 
                                      type="button" 
                                      className="list-group-item list-group-item-action"
                                      onClick={() => {this.props.editEvent(this.state.userEvents[key])}}
                                  >
                                    {this.state.userEvents[key].title}
                                  </button>
                                </div>
                            ))
                            :
                            "You haven't published any events yet."
                        }
                    </div>
                </div>
            </div>
        );
    } 
    return null;
  }
}

export default withRouter(DisplayEvent);