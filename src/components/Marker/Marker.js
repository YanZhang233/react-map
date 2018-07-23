import React, { Component } from 'react';
import InfoWindow from '../InfoWindow/InfoWindow.js';

const google = window.google;

class Marker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            marker: null
        };
    }

    componentDidMount() {
        this.addMarker(this.props.map, this.props.marker);
    }

    addMarker = (map, marker) => {

        const flag = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

        // const geocoder = new google.maps.Geocoder();

        // geocoder.geocode({ 'address': "Gelman Library"}, (results, status) => {
        //     if(status === google.maps.GeocoderStatus.OK) {
        //         const position = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
        //         const marker = new google.maps.Marker({position: position, map: map, icon: flag});
        //         console.log(position);

        //     }
        // });

        const location = {
            lat: marker.latitude,
            lng: marker.longitude
        };

        const loadMarker = new google.maps.Marker({position: location, map: map, icon: flag, animation: google.maps.Animation.DROP});

        this.setState({marker: loadMarker});

    }

    render() {
        if(this.state.marker && this.props.map) {
            return (
                <InfoWindow 
                    map={this.props.map}
                    marker={this.state.marker}
                    markerInfo={this.props.marker}
                />
            );
        } 
        return null;
    }

}

export default Marker;