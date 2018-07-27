import React, { Component } from 'react';
import axios from "../../base.js";
import Qs from 'qs';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

class MarketInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            infoOpen: false,
            marketInfo: []
        };
    }

    componentDidMount() {
        this.addMarketInfo(this.props.map, this.props.marketMarker, this.props.index);
    }

    addMarketInfo = (map, marketMarker, index) => {
        
        marketMarker.addListener("click", () => {
            this.getMarketGoods(index);
        });

        map.addListener("click", () => {
            this.closeInfoWindow();
        });

    }

    openMarketInfo = () => {
        this.setState({infoOpen: true});
    }

    closeMarketInfo = () => {
        this.setState({infoOpen: false});
    }

    getMarketGoods = (marketId) => {
        axios.get(`/event/sell/${marketId}`
        )
        .then(res => {
            console.log("market", res.data);
            if(res.data.status === 0) {
                this.setState({marketInfo: res.data.data});
                this.openMarketInfo();
            } else {
                alert(res.data.msg);
            }
        })

    }

    render() {
        if(this.state.infoOpen === true) {
            return (
                <ReactCSSTransitionGroup
                    transitionName="InfoWindowAppear"
                    transitionAppear={ true }
                    transitionAppearTimeout={ 800 }
                    transitionEnter={ false }
                    transitionLeave={ false }
                >
                    
                </ReactCSSTransitionGroup>
            );
        }

        return null;
    }
}

export default MarketInfo;