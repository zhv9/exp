import { createStore, combineReducers, applyMiddleware } from "redux";
import { routerMiddleware, routerReducer } from "react-router-redux";
import { history } from "./history";

const middleware = routerMiddleware(history);

export const store = createStore(
  combineReducers({ router: routerReducer }),
  applyMiddleware(middleware)
);
