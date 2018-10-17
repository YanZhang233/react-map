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
            searchMarker: null,
            dayMapType: null,
            nightMapType: null
        };

        this.searchRef = React.createRef();
        this.mapStyleRef = React.createRef();
    }

    componentDidMount() {

        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                currentCenter: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            }, () => {
                this.initCurrentTime();
                // this.initMap();
                this.searchPlace();
            });
        });
  
    }

    initCurrentTime = () => {
        const currentTime = new Date();
        const currentHour = currentTime.getHours() + 4;
        const currentMin = currentTime.getMinutes();

        axios.get(`https://api.sunrise-sunset.org/json?lat=${this.state.currentCenter.lat}&lng=${this.state.currentCenter.lng}&date=today&formatted=0`,
            {withCredentials: false}
        )
        .then(res => {
            console.log("sunrise-sunset", res.data);
            if(res.data.status === "OK") {
                const sunrise = res.data.results.sunrise;
                const sunset = res.data.results.sunset;

                //Night Mode
                if(currentHour < sunrise.substring(11, 13) 
                    || currentHour > sunset.substring(11, 13)
                    || currentHour === sunrise.substring(11, 13) && currentMin < sunrise.substring(14, 16)
                    || currentHour === sunset.substring(11, 13) && currentMin > sunset.substring(14, 16)) {

                    this.mapStyleRef.current.checked = true;
                } 

                this.initMap();

            } else {
                alert(res.data.msg);
            }
        })
    }

    initMap = () => {

        const node = ReactDOM.findDOMNode(this.refs.map);
        const currentCenter = this.state.currentCenter;

        const dayMapType = new google.maps.StyledMapType(
            [
                {
                    "featureType": "landscape",
                    "stylers": [
                        {
                            "hue": "#FFBB00"
                        },
                        {
                            "saturation": 43.400000000000006
                        },
                        {
                            "lightness": 37.599999999999994
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "stylers": [
                        {
                            "hue": "#FFC200"
                        },
                        {
                            "saturation": -61.8
                        },
                        {
                            "lightness": 45.599999999999994
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "stylers": [
                        {
                            "hue": "#FF0300"
                        },
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 51.19999999999999
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.icon",
                    "stylers": [
                        {"visibility": "off"}
                    ]
                },
                {
                    "featureType": "road.local",
                    "stylers": [
                        {
                            "hue": "#FF0300"
                        },
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 52
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "stylers": [
                        {
                            "hue": "#0078FF"
                        },
                        {
                            "saturation": -13.200000000000003
                        },
                        {
                            "lightness": 2.4000000000000057
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels",
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
                            "color": "#bde6ab"
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

        this.setState({dayMapType: dayMapType});
        this.setState({nightMapType: nightMapType});

        const map = new google.maps.Map(node, {
            zoom: 16,
            center: currentCenter,
            clickableIcons: false,
            disableDefaultUI: true,
            zoomControl: true
        });

        map.mapTypes.set('day_map', dayMapType);
        map.mapTypes.set('night_map', nightMapType);

        const nightModeMap = this.mapStyleRef.current.checked;

        if(nightModeMap === true) {
            map.setMapTypeId('night_map');
        } else {
            map.setMapTypeId('day_map');
        }

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

    handleMapStyleChange = (event) => {
        const nightModeMap = event.currentTarget.checked;

        this.state.map.mapTypes.set('day_map', this.state.dayMapType);
        this.state.map.mapTypes.set('night_map', this.state.nightMapType);

        if(nightModeMap === true) {
            this.state.map.setMapTypeId('night_map');
        } else {
            this.state.map.setMapTypeId('day_map');
        }
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
                        <a className="navItem">
                           <i className="fas fa-moon moon"></i>
                           <label className="switch">
                              <input ref={this.mapStyleRef} onChange={this.handleMapStyleChange} type="checkbox" />
                              <span className="slider round"></span>
                           </label>
                        </a>
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