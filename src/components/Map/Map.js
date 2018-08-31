import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router-dom';
import './Map.css';
import Marker from '../Marker/Marker.js';
import Event from '../Event.js';
import axios from "../../base.js";
import Loading from "../Loading/Loading.js";
import MarkerClusterer from '../../markerclusterer.js';
import Market from '../Market/Market.js';
import currentLocationIcon from '../../images/currentLocation.png';
import markerClusterIcon from '../../images/markerCluster.png';

/*global google*/

class Map extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentCenter: {
                lat: null,
                lng: null
            },
            map: null,
            publish: false,
            userEvent: false,
            markers: [],
            defaultEventPlace: {
                defaultPlace: null,
                defaultGeoLocation: {
                    lat: null,
                    lng: null
                }
            },
            markerCluster: null,
            searchMarker: null
        };

        this.searchRef = React.createRef();
    }

    componentDidMount() {

        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                currentCenter: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            }, () => {
                this.initMap();
                this.searchPlace();
            });
        });
  
    }

    initMap = () => {

        const node = ReactDOM.findDOMNode(this.refs.map);
        const currentCenter = this.state.currentCenter;

        const dayMapType = new google.maps.StyledMapType(
            [
               {
                    "featureType": "all",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "weight": "2.00"
                        }
                    ]
                },
                {
                    "featureType": "all",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#9c9c9c"
                        }
                    ]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#f2f2f2"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "landscape.man_made",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 45
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#eeeeee"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#7b7b7b"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#46bcec"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#c8d7d4"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#070707"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                }
            ],
            {name: 'Day Map'});

        const nightMapType = new google.maps.StyledMapType(
            [
               {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#193341"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#2c5a71"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#29768a"
                        },
                        {
                            "lightness": -37
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#406d80"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#406d80"
                        }
                    ]
                },
                {
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#3e606f"
                        },
                        {
                            "weight": 2
                        },
                        {
                            "gamma": 0.84
                        }
                    ]
                },
                {
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "weight": 0.6
                        },
                        {
                            "color": "#1a3541"
                        }
                    ]
                },
                {
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#2c5a71"
                        }
                    ]
                }
            ],
            {name: 'Night Map'});


        const map = new google.maps.Map(node, {
            zoom: 16,
            center: currentCenter,
            clickableIcons: false
        });

        map.mapTypes.set('day_map', dayMapType);
        map.mapTypes.set('night_map', nightMapType);
        // map.setMapTypeId('day_map');
        map.setMapTypeId('night_map');

        this.setState({map: map});

        const marker = new google.maps.Marker({position: currentCenter, map: map, icon: currentLocationIcon, animation: google.maps.Animation.DROP});

        this.getMarkers(currentCenter);

        map.addListener("dragend", () => {
            const center = {
                lat: map.getCenter().lat(),
                lng: map.getCenter().lng()
            }
            if(Math.abs(center.lat - this.state.currentCenter.lat) > 0.25 || Math.abs(center.lng - this.state.currentCenter.lng) > 0.25) {
                this.setState({ currentCenter: center }, this.getMarkers(center));
                this.setDefaultEventPlace(center);
            }
        });

        this.setDefaultEventPlace(this.state.currentCenter);

    }

    publishEvent = (event) => {
        if(this.props.user === null) {
            this.props.history.push(`/login`);
        } else {
            this.toggleEvent(event);
        }
    }

    toggleEvent = (event) => {
        if(this.state.userEvent === true) {
            this.setState({userEvent: false});
        }

        const publish = !this.state.publish;
        this.setState({publish: publish});
    }

    changeCenter = (center) => {
        this.getMarkers(center);
        this.state.map.setCenter(center);
    }

    getMarkers = (center) => {
        axios.get(`/event?longitude=${center.lng}&latitude=${center.lat}`
        )
        .then(res => {
            console.log("markers", res.data);
            if(res.data.status === 0) {
                this.clearAllMarkers();
                this.setState({markers: res.data.data}, this.initMarkerCluster);
            } else {
                alert(res.data.msg);
            }
        })
    }

    clearAllMarkers = () => {
        this.setState({ markers: [] }, () => {
            if(this.state.markerCluster !== null) {
                this.state.markerCluster.clearMarkers();
            }
        });
    }

    initMarkerCluster = () => {
        const clusterStyles = [
          {
            textColor: 'white',
            url: markerClusterIcon,
            height: 50,
            width: 50
          }
        ];
        const Options = {
            styles: clusterStyles
        };
        const markerCluster = new MarkerClusterer(this.state.map, [], Options);
        // const markerCluster = new MarkerClusterer(this.state.map, [], {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        this.setState({markerCluster: markerCluster});
    }

    pushIntoMarkerCluster = (marker) => {
        this.state.markerCluster.addMarker(marker);
        // console.log("cluster", this.state.markerCluster);
    }

    searchPlace = () => {
        const searchInput = ReactDOM.findDOMNode(this.searchRef.current);
        const autocomplete = new google.maps.places.Autocomplete(searchInput);
        autocomplete.addListener('place_changed', () => {
            if(this.state.searchMarker !== null) {
                this.state.searchMarker.setMap(null);
            }
            this.fillInSearchAddress(autocomplete);
            searchInput.value = null;
        });
    }

    fillInSearchAddress = (autocomplete) => {
        const autoPlace = autocomplete.getPlace();
        const center = {
            lat: autoPlace.geometry.location.lat(),
            lng: autoPlace.geometry.location.lng()
        };

        const search = new google.maps.Marker({position: center, map: this.state.map, animation: google.maps.Animation.BOUNCE});
        this.setState({searchMarker: search});
        
        // setTimeout(() => {
        //     searchMarker.setMap(null);
        // }, 5000);

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

    toggleUser = (event) => {
        if(this.state.publish === true) {
            this.setState({publish: false});
        }
        
        const userEvent = !this.state.userEvent;
        this.setState({userEvent: userEvent});
    }

    render() {

        return (
            <div>
                <div className="toggle-cta">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                      <a className="navbar-brand" href="/"><i className="fas fa-map-marker-alt"></i></a>
                      <a className="navItem" onClick={this.publishEvent}>Publish</a>
                      {this.props.user === null?
                            <a className="navItem" onClick={() => {this.props.history.push(`/login`)}}>
                                LogIn
                            </a>
                            :
                            <a className="navItem" onClick={this.toggleUser}>
                                {this.props.user.username}
                            </a>
                      }
                      {this.props.user === null?
                            <a className="navItem" onClick={() => {this.props.history.push(`/register`)}}>
                                SignUp
                            </a>
                            :
                            <a className="navItem" onClick={this.props.logout}>
                                Logout
                            </a>
                       }
                    </nav>
                    <Event 
                        map={this.state.map}
                        changeCenter={this.changeCenter}
                        toggleEvent={this.toggleEvent}
                        toggleUser={this.toggleUser}
                        markers={this.state.markers}
                        defaultEventPlace={this.state.defaultEventPlace}
                        publish={this.state.publish}
                        user={this.props.user}
                        userEvent={this.state.userEvent}
                    />
                </div>
                
                <div className="search">
                   <input className="form-control mr-sm-2" ref={this.searchRef} type="search" placeholder="Search..." aria-label="Search"/>
                </div>

                <div ref="map" className="map">
                    <Loading />
                    {this.state.markers !== null ?
                        Object.keys(this.state.markers).map(key => (
                            <Marker 
                                key={key}
                                map={this.state.map}
                                marker={this.state.markers[key]}
                                pushIntoMarkerCluster={this.pushIntoMarkerCluster}
                            />
                        ))
                        :""
                    }
                </div>
                {this.state.map !== null ?
                    <Market 
                        map={this.state.map}
                    />
                    :""
                }
            </div>
        );
    }

}

export default withRouter(Map);