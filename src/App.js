import React from "react";
import "./style/master.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Landing from "./components/pages/Landing";
// import AllKits from "./components/pages/AllKits";
import NotFound from "./components/pages/NotFound";
import ItemList from "./components/pages/ItemList";

function App() {
   // I think these declare different urls as differnt React components under the hood
   return (
      <Router>
         <Switch>
            <Route exact path="/" component={Landing} />
            {/* <Route exact path="/kits" component={AllKits} /> */}
            {/* handle gets any arbitrary text put in the url */}
            <Route exact path="/gear:handle" component={ItemList} />
            <Route component={NotFound} />
         </Switch>
      </Router>
   );
}

export default App;
