import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "./App.js";
import Login from "./Login/Login.js";
import Register from "./Register/Register.js";

const Router = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={App} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
            </Switch>
        </BrowserRouter>
    );
}

export default Router;