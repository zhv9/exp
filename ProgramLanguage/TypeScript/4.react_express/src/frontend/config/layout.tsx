import * as React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Header } from "../components/header_component";
import { HomePage } from "../pages/home_page";
import { MoviePage } from "../pages/movies_page";
import { ActorPage } from "../pages/actors_page";

export function Layout() {
  return (
    <BrowserRouter>
      <div>
        <Header
          bg="primary"
          title="TsMovies"
          rootPath="/"
          links={[
            { path: "/movies", text: "Moves" },
            { path: "/actors", text: "Actors" }
          ]}
        />
        <main style={{ paddingTop: "60px" }}>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/Movies" component={MoviePage} />
            <Route exact path="/Actor" component={ActorPage} />
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
}
