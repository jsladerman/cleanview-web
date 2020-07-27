import React, {Component} from 'react';
import styles from './css/DashboardSidebarContent.module.css';
import {Redirect} from "react-router-dom";

class DashboardSidebarContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect}/>
        }
        return (
            <div>
                <br/><p>Top</p>
                <button onClick={this.props.signOutFunc}>
                    Sign Out
                </button>
                <p>Sidebar content</p>
                <p>Sidebar content</p>
                <p>Sidebar content</p>
                <p>Sidebar content</p>
                <p>Sidebar content</p>
                <p>Sidebar content</p>
                <p>Sidebar content</p>
                <p>Sidebar content</p>
                <p>Sidebar content</p>
                <p>Sidebar content</p>
                <p>Sidebar content</p>
                <p>Sidebar content</p>
                <p>Sidebar content</p>
                <p>Sidebar content</p>
                <p>Sidebar content</p>
                <p>Sidebar content</p>
                <p>Sidebar content</p>
            </div>
        );
    }

}

export default DashboardSidebarContent;
