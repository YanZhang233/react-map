import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Map.css';
import Marker from '../Marker/Marker.js';
import InfoWindow from '../InfoWindow/InfoWindow.js';
import Event from '../Event.js';
import sampleMarkers from '../sample-markers.js';
import axios from "../../base.js";

const google = window.google;

class Map extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentCenter: {
                lat: null,
                lng: null
            },
            map: null,
            displayEvent: false,
            markers: [],
            defaultEventPlace: {
                defaultPlace: null,
                defaultGeoLocation: {
                    lat: null,
                    lng: null
                }
            }
        };

        this.searchRef = React.createRef();
    }

    componentDidMount() {
        // if(google) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.setState({
                    currentCenter: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                }, this.initMap);
            });
            this.searchPlace();
        // }
    }

    initMap = () => {

            const node = ReactDOM.findDOMNode(this.refs.map);
            const currentCenter = this.state.currentCenter;
            const map = new google.maps.Map(node, {
                zoom: 16,
                center: currentCenter
            });

            this.setState({map: map});

            const marker = new google.maps.Marker({position: currentCenter, map: map, animation: google.maps.Animation.DROP});

            this.getMarkers(currentCenter);

            map.addListener("dragend", () => {
                const center = {
                    lat: map.getCenter().lat(),
                    lng: map.getCenter().lng()
                }
                if(Math.abs(center.lat - this.state.currentCenter.lat) > 0.04 || Math.abs(center.lng - this.state.currentCenter.lng) > 0.04) {
                    this.setState({ currentCenter: center }, this.getMarkers(center));
                    this.setDefaultEventPlace(center);
                }
            });

            this.setDefaultEventPlace(this.state.currentCenter);

    }

    toggleEvent = (event) => {
        const display = !this.state.displayEvent;
        this.setState({displayEvent: display});
    }

    changeCenter = (center) => {
        this.state.map.setCenter(center);
        this.getMarkers(center);
    }

    getMarkers = (center) => {
        axios.get(`/event?longitude=${center.lng}&latitude=${center.lat}`
        )
        .then(res => {
            console.log(res.data);
            if(res.data.status === 0) {
                this.clearMarkers();
                this.setState({markers: res.data.data});
            } else {
                alert("Get events failed!");
            }
        })
    }

    clearMarkers = () => {
        this.setState({ markers: null });
    }

    searchPlace = () => {
        const searchInput = ReactDOM.findDOMNode(this.searchRef.current);
        if(google) {
            const autocomplete = new google.maps.places.Autocomplete(searchInput);
            autocomplete.addListener('place_changed', () => {
                this.fillInSearchAddress(autocomplete)
            });
        }
    }

    fillInSearchAddress = (autocomplete) => {
        const autoPlace = autocomplete.getPlace();
        const center = {
            lat: autoPlace.geometry.location.lat(),
            lng: autoPlace.geometry.location.lng()
        };
        
        this.changeCenter(center);
        this.setDefaultEventPlace(center);
    }

    setDefaultEventPlace = (geolocation) => {

        let place;

        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ 'location': geolocation}, (results, status) => {
            if(status === google.maps.GeocoderStatus.OK) {
                place = results[0].formatted_address;
                const newDefaultEventPlace = {
                    defaultPlace: place,
                    defaultGeoLocation: {
                        lat: geolocation.lat,
                        lng: geolocation.lng
                    }
                }

                this.setState({defaultEventPlace: newDefaultEventPlace});
            }
        });

    }

    render() {
        return (
            <div>
                <div className="toggle-cta">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                      <a className="navbar-brand" href="/"><i className="fas fa-map-marker-alt"></i></a>
                      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                      </button>

                      <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                          <li className="nav-item">
                            <a className="nav-link" onClick={this.toggleEvent}>Publish</a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link" href="#">MyAccount</a>
                          </li>
                        </ul>
                        <form className="form-inline my-2 my-lg-0">
                          <input className="form-control mr-sm-2" ref={this.searchRef} type="search" placeholder="Search" aria-label="Search"/>
                          <a className="navbar-brand" href="#"><i className="fas fa-search"></i></a>
                        </form>
                      </div>
                    </nav>

                    {this.state.displayEvent === true ?
                        <Event 
                            map={this.state.map}
                            changeCenter={this.changeCenter}
                            toggleEvent={this.toggleEvent}
                            markers={this.state.markers}
                            defaultEventPlace={this.state.defaultEventPlace}
                        />
                        :""
                    }
                </div>
                  
            
                    <div ref="map" className="map">
                        Loading...
                        {this.state.markers !== null?
                            Object.keys(this.state.markers).map(key => (
                                <Marker 
                                    key={key}
                                    map={this.state.map}
                                    marker={this.state.markers[key]}
                                />
                            ))
                            :""
                        }
                    </div>

            </div>
        );
    }

}

export default Map;