import React, {Component} from 'react';
import styles from './css/DashboardSidebarContent.module.css';
import SidebarButton from "./SidebarButton";

class DashboardSidebarContent extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        const activeTab = this.getActiveTab();
        return (
            <div>
                <p></p>
                <SidebarButton
                    active={activeTab==='locations'}
                    imgName='locations.svg'
                    text='Locations'
                    urlPath='/locations'/>
                <SidebarButton
                    active={activeTab==='billing'}
                    imgName='billing.svg'
                    text='Billing'
                    urlPath='/billing'/>
                <SidebarButton
                    active={activeTab==='settings'}
                    imgName='settings.svg'
                    text='Settings'
                    urlPath='/settings'/>
            </div>
        );
    }

    getActiveTab = () => {
        const pathArr = this.props.path.split('/')
        return pathArr[pathArr.length - 1]
    }

}

export default DashboardSidebarContent;
