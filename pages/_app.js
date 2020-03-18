import App, { Container } from "next/app";
import React from "react";
import withReduxStore from "../lib/with-redux-store";
import { Provider } from "react-redux";
import Gun from "gun/gun";
import { SERVER_URL } from "../constants";
import "gun/lib/not.js";

const serverUrlWSS = SERVER_URL.replace("https://", "wss://").replace(
  "http://",
  "ws://"
);

global.gun = Gun([serverUrlWSS + "/gun"]);

gun.get("rooms").once(a => {
  console.log("init gun");
});

class MyApp extends App {
  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Container>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default withReduxStore(MyApp);
