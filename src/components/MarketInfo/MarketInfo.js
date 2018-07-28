import React, { Component } from 'react';
import axios from "../../base.js";
import Qs from 'qs';
import './MarketInfo.css';
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
            this.closeMarketInfo();
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
                    <div className="marketInfo-cta">
                        <i className="close far fa-times-circle" onClick={this.closeMarketInfo}></i>

                        <div className="market-info">
                            {this.state.marketInfo !== null ?
                                Object.keys(this.state.marketInfo).map(key => (
                                    <div
                                        key={key}
                                        className="single-info"
                                    >
                                        <div className="subject">{this.state.marketInfo[key].subject}</div>
                                        <i className="far fa-clock"></i> {this.state.marketInfo[key].publishDate}
                                        <span className="address">
                                            <i className="fas fa-map-marker-alt"></i> {this.state.marketInfo[key].address}
                                        </span>
                                        <i className="fas fa-user"></i> {this.state.marketInfo[key].username}
                                        <br/>
                                        <button className="link" onClick={() => window.open(this.state.marketInfo[key].url)}>View Details</button>
                                    </div>
                                ))
                                :""
                            }
                        </div>

                    </div>
                </ReactCSSTransitionGroup>
            );
        }

        return null;
    }
}

export default MarketInfo;