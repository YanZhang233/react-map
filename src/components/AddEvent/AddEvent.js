import React, { Component } from 'react';
import './AddEvent.css';
import ReactDOM from 'react-dom';
import axios from "../../base.js";
import Qs from 'qs';
import markerIcon from '../../images/marker.png';

/*global google*/

class AddEvent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            geoLocation: this.props.defaultEventPlace.defaultGeoLocation,
            newMarker: null
        };

        this.titleRef = React.createRef();
        this.categoryRef = React.createRef();
        this.placeRef = React.createRef();
        this.timeRef = React.createRef();
        this.durationRef = React.createRef();
        this.descriptionRef = React.createRef();
    }

    componentDidMount() {
        this.initDateTime();
        this.initPlaceMap();
    }

    componentWillUnmount() {
        if(this.state.newMarker !== null) {
            this.state.newMarker.setMap(null);
        }
    }

    initDateTime = () => {
        const today = new Date();
        let day = today.getDate();
        if(day < 10) {
            day = "0" + day;
        }
        let month = today.getMonth() + 1;
        if(month < 10) {
            month = "0" + month;
        }
        const year = today.getFullYear();
        const hour = today.getHours();
        const min = today.getMinutes();
        const dateTime = year + "-" + month + "-" + day + "T" + hour + ":" + min;

        const timeInput = ReactDOM.findDOMNode(this.timeRef.current);
        timeInput.value = dateTime;
    }

    initPlaceMap = () => {
        const placeInput = ReactDOM.findDOMNode(this.placeRef.current);
        placeInput.value = this.props.defaultEventPlace.defaultPlace;
        const marker = new google.maps.Marker({position: this.state.geoLocation, map: this.props.map});
        this.setState({newMarker: marker}, () => {
          this.state.newMarker.setIcon(markerIcon);
          this.state.newMarker.setAnimation(google.maps.Animation.BOUNCE);
        });
        if(google) {
            const autocomplete = new google.maps.places.Autocomplete(placeInput);
            autocomplete.addListener('place_changed', () => {
                this.fillInAddress(autocomplete)
            });
        }
    }

    fillInAddress = (autocomplete) => {
        if(this.state.newMarker !== null) {
            this.state.newMarker.setMap(null);
        }
        console.log(autocomplete);
        const autoPlace = autocomplete.getPlace();
        const geoLocation = {
            lat: autoPlace.geometry.location.lat(),
            lng: autoPlace.geometry.location.lng()
        };
        this.setState({ geoLocation: geoLocation });
        this.props.changeCenter(this.state.geoLocation);
        const marker = new google.maps.Marker({position: this.state.geoLocation, map: this.props.map});
        this.setState({newMarker: marker}, () => {
          this.state.newMarker.setIcon(markerIcon);
          this.state.newMarker.setAnimation(google.maps.Animation.BOUNCE);
        });
    }

    handleSubmit = event => {
        event.preventDefault();

        if(this.state.newMarker !== null) {
            this.state.newMarker.setMap(null);
        }
        // this.state.newMarker.setAnimation(null);
        // this.state.newMarker.setIcon('https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png');

        this.props.toggleEvent();

        const title = this.titleRef.current.value;
        const address = this.placeRef.current.value;
        const category = 0;
        const longitude = this.state.geoLocation.lng.toFixed(3);
        const latitude = this.state.geoLocation.lat.toFixed(3);
        const description = this.descriptionRef.current.value;
        const date = this.timeRef.current.value;

        const duration = this.durationRef.current.checked;
        let expireDays = 3;
        //Long-term
        if(duration === true) {
            expireDays = 365;
        }

        axios.post(`/event`, 
                Qs.stringify({ 
                    title,
                    address, 
                    category,
                    longitude,
                    latitude,
                    description,
                    date,
                    expireDays
                }),
        )
        .then(res => {
            console.log(res.data);
            if(res.data.status === 0) {
                this.props.changeCenter(this.state.geoLocation);
            } else {
                alert(res.data.msg);
            }
        })
        
    }

    render() {

        return (
            <div className="container event">
                <div className="event-form">
                    <form onSubmit={this.handleSubmit}>
                      <div className="form-group">
                        <label htmlFor="title">Event Title</label>
                        <input 
                            required
                            name="title"
                            type="text" 
                            className="form-control" 
                            id="title" 
                            ref={this.titleRef}
                            placeholder="e.g. Hiking"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="place">Place</label>
                        <input required name="place" type="text" className="form-control" id="place" ref={this.placeRef}/>
                      </div>
                      <div className="form-group form-check">
                        <input className="form-check-input" type="checkbox" id="duration" name="duration" ref={this.durationRef}/>
                        <label className="form-check-label" htmlFor="duration">
                        Long-term
                        </label>
                      </div>
                      <div className="form-group">
                        <label htmlFor="time">Time</label>
                        <input required name="time" type="datetime-local" className="form-control" id="time" ref={this.timeRef}/>
                      </div>
                      <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input name="description" type="text" className="form-control" id="description" ref={this.descriptionRef} placeholder="e.g. This is..."/>
                      </div>
                      <button className="btn btn-primary btn-block" type="submit">Publish</button>
                    </form>

                </div>
            </div>
        );
    }
}

export default AddEvent;