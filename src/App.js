import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard"

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path='/home' component={Dashboard}/>
                    <Route path='/login' component={Login}/>
                    <Route path='/'>
                        <Redirect to='/login'/>
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default App;
