import React from "react";
import { Provider } from "react-redux";
import { Route } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import App from "./App";
import Edit from "./Edit";
import { store } from "./store";
import { history } from "./store/history";

export default () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <>
        <Route exact path="/" component={App} />
        <Route path="/edit" component={Edit} />
      </>
    </ConnectedRouter>
  </Provider>
);
