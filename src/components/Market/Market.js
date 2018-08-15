import React, { Component } from 'react';
import MarketInfo from '../MarketInfo/MarketInfo.js';
import marketIcon from '../../images/market.png';

/*global google*/

class Market extends Component {

    constructor(props) {
        super(props);

        this.state = {
            markets: []
        };
    }

    componentDidMount() {
        this.initMarket();
    }

    initMarket = () => {

        // const geocoder = new google.maps.Geocoder();

        // geocoder.geocode({ 'address': "Crystal City, Arlington, VA, USA"}, (results, status) => {
        //     if(status === google.maps.GeocoderStatus.OK) {
        //         const position = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
        //         const marker = new google.maps.Marker({position: position, map: this.props.map});
        //         console.log("position", position);

        //     }
        // });

        const DCLocation = {
            lat: 38.9071923,
            lng: -77.03687070000001
        };

        const VALocation = {
            lat: 38.855,
            lng: -77.052
        };

        const MDLocation = {
            lat: 39.0839973,
            lng: -77.15275780000002
        };

        const DCMarker = new google.maps.Marker({position: DCLocation, map: this.props.map, icon: marketIcon, animation: google.maps.Animation.DROP});
        const VAMarker = new google.maps.Marker({position: VALocation, map: this.props.map, icon: marketIcon, animation: google.maps.Animation.DROP});
        const MDMarker = new google.maps.Marker({position: MDLocation, map: this.props.map, icon: marketIcon, animation: google.maps.Animation.DROP});

        let markets = [];
        markets.push(DCMarker);
        markets.push(VAMarker);
        markets.push(MDMarker);

        this.setState({markets: markets});

    }

    render() {
        if(this.state.markets && this.props.map) {
            return (
                Object.keys(this.state.markets).map(key => (
                    <MarketInfo
                        key={key}
                        index={key}
                        map={this.props.map}
                        marketMarker={this.state.markets[key]}
                    />
                ))
            );
        } 
        return null;
    }
}

export default Market;