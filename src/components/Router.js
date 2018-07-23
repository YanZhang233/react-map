import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Event from "./Event.js";

const Router = () => {
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={App}>
            <Route path="/event" component={Event}>
        </Switch>
    </BrowserRouter>
}

export default Router;