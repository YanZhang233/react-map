import React, { Component } from 'react';
import './AddEvent.css';
import ReactDOM from 'react-dom';
import axios from "../../base.js";
import Qs from 'qs';

const google = window.google;

class AddEvent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            geoLocation: {
                lat: null,
                lng: null
            },
            markers: this.props.markers,
            newMarker: null
        };

        this.titleRef = React.createRef();
        this.categoryRef = React.createRef();
        this.placeRef = React.createRef();
        this.timeRef = React.createRef();
        this.durationRef = React.createRef();
        this.descriptionRef = React.createRef();
        this.contactRef = React.createRef();
    }

    componentDidMount() {
        console.log(this.state.markers);
        this.initPlaceMap();
    }

    initPlaceMap = () => {
        const placeInput = ReactDOM.findDOMNode(this.placeRef.current);
        if(google) {
            const autocomplete = new google.maps.places.Autocomplete(placeInput);
            // autocomplete.addListener('place_changed', this.fillInAddress(autocomplete));
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
          this.state.newMarker.setAnimation(google.maps.Animation.BOUNCE);
        });
    }

    handleSubmit = event => {
        event.preventDefault();

        this.state.newMarker.setMap(null);
        // this.state.newMarker.setAnimation(null);
        // this.state.newMarker.setIcon('https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png');

        this.props.toggleEvent();

        const title = this.titleRef.current.value;
        const address = this.placeRef.current.value;
        const category = this.categoryRef.current.value;
        const longitude = this.state.geoLocation.lng.toFixed(5);
        const latitude = this.state.geoLocation.lat.toFixed(5);
        const description = this.descriptionRef.current.value;
        const date = this.timeRef.current.value;

        const duration = this.durationRef.current.value;
        let expireDays = duration + 1;
        if(duration === 3) {
            expireDays = 365;
        }

        const contact = this.contactRef.current.value;

        axios.post(`/event`, 
                Qs.stringify({ 
                    title,
                    address, 
                    category,
                    longitude,
                    latitude,
                    description,
                    date,
                    expireDays,
                    contact
                }),
        )
        .then(res => {
            console.log(res.data);
            if(res.data.status === 0) {
                this.props.changeCenter(this.state.geoLocation);
            } else {
                alert("Add event failed!");
            }
        })
        
    }

    render() {
        return (
            <div className="container event">
                <div className="formDiv">
                    <form onSubmit={this.handleSubmit}>
                      <div className="form-group">
                        <label htmlFor="title">Event Title</label>
                        <input 
                            
                            name="title"
                            type="text" 
                            className="form-control" 
                            id="title" 
                            ref={this.titleRef}
                            placeholder="e.g. Hiking"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select className="form-control" id="category" name="category" ref={this.categoryRef}>
                          <option value="0">Sport</option>
                          <option value="1">Game</option>
                          <option value="2">Hobby</option>
                          <option value="3">Outdoor</option>
                          <option value="4">Help</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="place">Place</label>
                        <input name="place" type="text" className="form-control" id="place" ref={this.placeRef} placeholder="e.g. Long Bridge Park"/>
                      </div>
                      <div className="form-group">
                        <label htmlFor="time">Time</label>
                        <input name="time" type="datetime-local" className="form-control" id="time" ref={this.timeRef} placeholder="e.g. 2018-10-03"/>
                      </div>
                      <div className="form-group">
                        <label htmlFor="duration">Duration</label>
                        <select className="form-control" id="duration" name="duration" ref={this.durationRef}>
                          <option value="0">1 Day</option>
                          <option value="1">2 Days</option>
                          <option value="2">3 Days</option>
                          <option value="3">Long-term</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input name="description" type="text" className="form-control" id="description" ref={this.descriptionRef} placeholder="e.g. This is..."/>
                      </div>
                      <div className="form-group">
                        <label htmlFor="contact">Contact</label>
                        <input name="contact" type="text" className="form-control" id="contact" ref={this.contactRef} placeholder="e.g. wechat:123"/>
                      </div>

                      <button className="btn btn-primary btn-block" type="submit">Publish</button>
                    </form>

                </div>
            </div>
        );
    }
}

export default AddEvent;