import React, { Component } from 'react';
import MarketInfo from '../MarketInfo/MarketInfo.js';
import marketIcon from '../../images/market.png';
import './Market.css';

/*global google*/

class Market extends Component {

    constructor(props) {
        super(props);

        this.state = {
            markets: [],
            marketInfo: null
        };
    }

    componentDidMount() {
        this.initMarket();
    }

    componentWillUnmount() {
        if(this.state.marketInfo !== null) {
            this.state.marketInfo.setMap(null);
        }
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

        this.addDCMarketInfo(this.props.map, DCMarker);
        this.addVAMarketInfo(this.props.map, VAMarker);
        this.addMDMarketInfo(this.props.map, MDMarker);

        let markets = [];
        markets.push(DCMarker);
        markets.push(VAMarker);
        markets.push(MDMarker);

        this.setState({markets: markets});

    }

    addDCMarketInfo = (map, marker) => {
        const contentString = "<div class='marketInfo'>" + 
        "<img src='data:image/png;base64,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'>" +
        " On Sell~" + 
        "</div>";
        const marketInfo = new google.maps.InfoWindow({
            content: contentString,
            disableAutoPan: true
        });

        this.setState({marketInfo: marketInfo}, () => {
            marketInfo.open(map, marker);
        });
    }

    addVAMarketInfo = (map, marker) => {
        const contentString = "<div class='marketInfo'>" + 
        "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAVXSURBVFhH7VhbTFxVFCWpH/plTKwm9f1MWmOMr/rTRDGWUGYuFC1oNKkfNlFj2ohKE5uqjYoYU1CjbSkYaS0lZVCZB5kHMwit4VGx2GIpBZwZpiZqNPqFthDmbNc+99yZe2du0xmYD01YyQo35+y91r773HvPYYqWsYz/A0RAqxYBZy84Au4Vocpr1FTOEBHtWuHXmpQGtLRqNbU0UMD5PgU0okAlUehJ/NVI+J2/iWDFDcK/8bakb339fOfdf851rE7OddxJOlcneSzpLXlPhLRbKOy8EQX9IXVCT+larBPQ6pXN4oA7vQ9MUuRFohE/0fcRosEmiJezeELOwWihay3NHbnDwoWuh1QRziQ6l6AgihvYr2t8103U+4I+F3Tco+zyBzr1mrzroQO6MHP4MIw3SvM0nTTvWpMqbt51lxyzxASRw7mGzmCrHBdB7VVllz9wh9uk+ECzLnq8A0ZPWI0Vk77iVIFJ7yO2MTJ32KUKhCbG0N2tyi5/ULfjVgicp57N6CLuuOeZbFMT8dxJ2s2lyBrcPWiiAf9QoOJmZbc4oMDnsNTztmYZXPCsowX3Otu5TLImayubpQEvxA47kyz6y3TazWVQBByvK/mlAcuAN1n7O9Mg+nkZfVNfSr+2OyzjZv7S5pAx0dbsollT+MvvVTaLg/CXXg+hnzPFT+0poy8a6ujg7jqqqSi2LZLH9uysIe+BZtqmFdPY3g1ZMazNHsouP1Dfw5fhGTmeKco8XLuehiMBGgoHaKuzWHYpM4bHPK37KTF1Vsa015ZkxTCxQkPkqlqhbHMHv/4WsSB2keDj8npgd6k0ZXJ3YlhuSyzIy8pzRtxgg7oJ1mAtUyyKfEnZ5g60fzIl0v8Gvl1h7CbYAfjz4EeRDRvQyRL6cZ9e3AWvkyY/K5Oc8+p5vKwcw8VxDoWf1XcR1urfmS7Qr00o29yA52KlkSw51KZ/XJn9b6XHDfZUUceb1aluuXZhv+2pzo7jXEOHNc1zXufVyv7SwPZzuyWZ79bUQcvc0S1EP7kocbSFtleVUu2mUjp3rIUo+iXRseetsdxB1sjoIJM9dfccIDo2XYElvmAWMD+DKUbQqWgn0YyXZsc7yf3xDsnZcWxnGKMo/oatz5vUCFm7iyU+j5fycmWfG1Bgm1nElmMf6oWAsb4WOvLBdkm+NsZp7CP7XBPxkhxStrlD+BzX2X0DUxx8JV3EpTjwsr0GKL+FPeWrlG1+kAfN/i1/WURDOGyO4GGPe+yLsWPcredwrkmLtfngq+zyh5hxr5EG0+1Epz8lOoMDZ+wrkzGKPIPl5HFjTBLj4zjYTuBIxcUZ4zG8OBzLWqyJMfZQdvlDzHga06YmGkajdXgjd+mcxmfDmOdrY3z0XcSiWM4xayiyh7LLD0SuFUj+3SqIzpxqTJsb/KHe2ql4lz6WGTeGXNYwaUoPeCnb3CES7gfMQpLmzhjkQszLbpDH7Io0d9pgovt+ZZs7RMxTkSXEpifeTpud/kTvVmacQZ7jGCP+xDvQ+DorDs0oV7a5gxLuxzKFJLnIKXSBdwq7eTvKnEO2xTGxzI8q29whpvwr7cQKTRH3CPZStvkBd9ZnJ1pIiri3V9nlDxH1rRUz3nk74UIQ2nPinPdBZbc4iLivEsswa2ewFLImayubpQFv2SpxsuEsTR60msQ8SXRhFGbNWKoakfBtluRrHuM5xJhzWEOcbJxgTSVfGOD/2OnUXhzGMSvyNM5wlV41fVGIUKWPY2WO2otZS00XDvwLAM5tTeAgTiDfyl+9wlVXqumLgrodV3Es58hcv7ZPdJfdpKaXsYz/OIqK/gVGbNEk+87JngAAAABJRU5ErkJggg=='>" +
        " On Sell~" + 
        "</div>";
        const marketInfo = new google.maps.InfoWindow({
            content: contentString,
            disableAutoPan: true
        });

        this.setState({marketInfo: marketInfo}, () => {
            marketInfo.open(map, marker);
        });
    }

    addMDMarketInfo = (map, marker) => {
        const contentString = "<div class='marketInfo'>" + 
        "<img src='data:image/png;base64,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'>" +
        " On Sell~" + 
        "</div>";
        const marketInfo = new google.maps.InfoWindow({
            content: contentString,
            disableAutoPan: true
        });

        this.setState({marketInfo: marketInfo}, () => {
            marketInfo.open(map, marker);
        });
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