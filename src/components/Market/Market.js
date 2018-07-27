import React, { Component } from 'react';
import axios from "../../base.js";
import Qs from 'qs';
import marketIcon from '../../images/market.png';

const google = window.google;

class Market extends Component {

    constructor(props) {
        super(props);

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

        DCMarker.addListener("click", () => {
            this.getMarketGoods(0);
        });

        VAMarker.addListener("click", () => {
            this.getMarketGoods(1);
        });

        MDMarker.addListener("click", () => {
            this.getMarketGoods(2);
        });

    }

    getMarketGoods = (marketId) => {
        axios.get(`/event/sell/${marketId}`
        )
        .then(res => {
            console.log("market", res.data);
            // if(res.data.status === 0) {
            //     this.clearMarkers();
            //     this.setState({markers: res.data.data}, this.initMarkerCluster);
            // } else {
            //     alert(res.data.msg);
            // }
        })

    }





    render() {
      return null;
    }
}

export default Market;