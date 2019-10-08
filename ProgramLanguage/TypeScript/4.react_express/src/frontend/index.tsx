import React from "react";
import * as ReactDom from "react-dom";
import "reflect-metadata";
import { Layout } from "./config/layout";

const selector = "#root";
const $element = document.querySelector(selector);

if (!$element) {
  throw new Error(`Node ${selector} not found!`);
}
ReactDom.render(<Layout />, $element);
