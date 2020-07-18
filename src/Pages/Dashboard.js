import React, {Component} from 'react';
import styles from './css/Dashboard.css';
import DashboardTopNav from "../Components/Dashboard/DashboardTopNav";
import DashboardSidebarContent from "../Components/Dashboard/DashboardSidebarContent";
import Sidebar from 'react-sidebar'

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div style={{height:'100vh', width:'100vw', overflow:'hidden'}}>
                <DashboardTopNav/>
                <Sidebar sidebar={
                    <DashboardSidebarContent/>
                }
                         docked={true}
                         defaultSidebarWidth='150px'
                         styles={{root:{top:'100px'},
                             sidebar:{width:'150px', backgroundColor:'#30B3CA'},
                             overlay:{backgroundColor:'transparent'}}}/>

                <div style={{position:'relative',background: 'grey', width:'100%', height:'100%', marginLeft:'150px'}}>
                    <button onClick={this.goToDashboard}>Button</button>
                </div>
            </div>
        );
    }

}

export default Dashboard;
