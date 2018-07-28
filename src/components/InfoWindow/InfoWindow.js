import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from "../../base.js";
import "./InfoWindow.css";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

class InfoWindow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            infoOpen: false,
            events: [],
            eventIndex: 0,
            event: {
                title: null,
                day: null,
                month: null,
                time: null,
                duration: null,
                username: null,
                description: null
            }
        };

        this.flashRef = React.createRef();
    }

    componentDidMount() {
        this.addInfoWindow(this.props.map, this.props.marker);
    }

    addInfoWindow = (map, marker) => {
        
        marker.addListener("click", () => {
            this.getEvents(this.props.markerInfo.id);
        });

        map.addListener("click", () => {
            this.closeInfoWindow();
        });

    }

    openInfoWindow = () => {
        this.setState({infoOpen: true});
    }

    closeInfoWindow = () => {
        this.setState({infoOpen: false});
    }

    getEvents = (id) => {
        axios.get(`/event/place/${id}`
        )
        .then(res => {
            console.log("events",res.data);
            if(res.data.status === 0) {
                this.setState({events: res.data.data}, this.parseEvent);
                this.openInfoWindow();
            } else {
                alert("Loading events failed!");
            }
        })
    }

    parseEvent = () => {
        const e = this.state.events[this.state.eventIndex];
        let mon;
        switch (e.date.substring(5, 7)) {
            case "01":
                mon = "Jan";
                break;
            case "02":
                mon = "Feb";
                break;
            case "03":
                mon = "Mar";
                break;
            case "04":
                mon = "Apr";
                break;
            case "05":
                mon = "May";
                break;
            case "06":
                mon = "Jun";
                break; 
            case "07":
                mon = "Jul";
                break;
            case "08":
                mon = "Aug";
                break;
            case "09":
                mon = "Sep";
                break;
            case "10":
                mon = "Oct";
                break;
            case "11":
                mon = "Nov";
                break;
            case "12":
                mon = "Dec";
                break;   
        }

        let dur;
        switch (e.expireDays) {
            case 1:
                dur = "1Day";
                break;
            case 2:
                dur = "2Days";
                break;
            case 3:
                dur = "3Days";
                break;
            default:
                dur = "1Year";
                break;
        }

        const event = {
            title: e.title,
            day: e.date.substring(8, 10),
            month: mon,
            time: e.date.substring(11, 16),
            duration: dur,
            username: e.username,
            description: e.description
        };

        this.setState({ event: event });

    }

    changeEventIndex = (index) => {
        if(index < 0) {
            index = this.state.events.length - 1;
        } else if(index === this.state.events.length) {
            index = 0;
        }
        this.setState({ eventIndex: index }, this.parseEvent);

        this.flashInfowindow();
    }

    flashInfowindow = () => {
        const flash = ReactDOM.findDOMNode(this.flashRef.current);
        flash.classList.add("flash");
        setTimeout(() => {
            flash.classList.remove("flash");
        }, 1000);
    }

    render() {

        if(this.state.infoOpen === true) {
            return (
                <ReactCSSTransitionGroup
                    transitionName="InfoWindowAppear"
                    transitionAppear={ true }
                    transitionAppearTimeout={ 800 }
                    transitionEnter={ false }
                    transitionLeave={ false }
                >
                    <div className = "event-cta swiper-container">
                        <i className="close far fa-times-circle" onClick={this.closeInfoWindow}></i>

                            <div className="event-info swiper-wrapper" ref={this.flashRef}>
                                <div className="title">{this.state.event.title}</div>
                                <div className="flex-cta">
                                    <div className="date-cta">
                                      <div className="date">
                                        <div className="day">{this.state.event.day}</div>       
                                        <div>{this.state.event.month}</div>
                                      </div>
                                    </div>
                                    <div className="detail-cta">
                                        <div className="address">
                                            <i className="fas fa-map-marker-alt"></i> {this.props.markerInfo.placeName}
                                        </div>
                                        <i className="far fa-clock"></i> {this.state.event.time}
                                        <span className="duration">
                                            <i className="fas fa-calendar-alt"></i> {this.state.event.duration}
                                        </span>
                                        <div className="username">
                                          <i className="fas fa-user"></i> {this.state.event.username}
                                        </div>
                                    </div>
                                </div>
                                <div className="description">
                                    {this.state.event.description}
                                </div>
                            </div>

                        <div className="shift">
                            <div className="left swiper-button-prev" onClick={() => {this.changeEventIndex(this.state.eventIndex - 1)}}><i className="fas fa-chevron-left"></i></div>
                            <div className="right swiper-button-next" onClick={() => {this.changeEventIndex(this.state.eventIndex + 1)}}><i className="fas fa-chevron-right"></i></div>
                        </div>
                        <div className="swiper-pagination"></div>

                    </div>
                </ReactCSSTransitionGroup>
            );
        }

        return null;
    }

}

export default InfoWindow;