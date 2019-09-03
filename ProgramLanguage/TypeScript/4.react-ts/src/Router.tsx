import { createBrowserHistory } from "history";
import React from "react";
import { Route, Router } from "react-router";
import App from "./App";
import Edit from "./Edit";

const history = createBrowserHistory();

export default () => (
  <Router history={history}>
    <>
      <Route exact path="/" component={App} />
      <Route exact path="/edit" component={Edit} />
    </>
  </Router>
);
