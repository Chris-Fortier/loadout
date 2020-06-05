import React from "react"
import "./style/master.scss"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Landing from "./components/pages/Landing"
import AllKits from "./components/pages/AllKits"
import KitList from "./components/pages/KitList"
import NotFound from "./components/pages/NotFound"

function App() {
  // I think these declare different urls as differnt React components under the hood
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/all-kits" component={AllKits} />
        <Route exact path="/kit-list" component={KitList} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default App
