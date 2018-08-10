import React, { Component } from 'react';
import InfoWindow from '../InfoWindow/InfoWindow.js';
import markerIcon from '../../images/marker.png';
import './Marker.css';

/*global google*/

class Marker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            marker: null,
            eventTitles: [],
            infoTitle: null
        };
    }

    componentDidMount() {
        if(this.props.marker.eventNum > 0) {
            this.addMarker(this.props.map, this.props.marker);
        }
    }

    componentWillUnmount() {
        if(this.state.marker !== null) {
            this.state.marker.setMap(null);
        }
        if(this.state.infoTitle !== null) {
            this.state.infoTitle.setMap(null);
        }
    }

    addMarker = (map, marker) => {

        // const flag = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

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

        const loadMarker = new google.maps.Marker({position: location, map: map, icon: markerIcon, animation: google.maps.Animation.DROP});

        this.setState({marker: loadMarker, eventTitles: marker.eventTitles}, () => {
            this.props.pushIntoMarkerCluster(loadMarker);
            this.addInfoTitle(map, loadMarker);
        });

    }

    addInfoTitle = (map, marker) => {
        let infoTitle = new google.maps.InfoWindow();

        if(this.state.eventTitles === 1) {
            infoTitle.setContent(
                "<div class='titleCarousel'>" + this.state.eventTitles[0] + "</div>"
            );
        } else {
            infoTitle.setContent(
                "<div class='titleCarousel'>" + this.state.eventTitles[0] + "</div>"
            );
            let i = 1;
            setInterval(() => {
                if(i === this.state.eventTitles.length) {
                    i = 0;
                }
                infoTitle.setContent(
                    "<div class='titleCarousel'>" + this.state.eventTitles[i] + "</div>"
                );
                i++;
            }, 2000);
        }

        this.setState({infoTitle: infoTitle}, () => {
            this.state.infoTitle.open(map, marker);
        });
        
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