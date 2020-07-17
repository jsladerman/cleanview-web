import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard"

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path='/home'>
                        <Dashboard/>
                    </Route>
                    <Route path='/'>
                        <Home/>
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default App;