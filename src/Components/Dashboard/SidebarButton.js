import React, {Component} from 'react';
import styles from './css/SidebarButton.module.css';
import ClickableOverlay from "../Custom/ClickableOverlay";
import {Redirect} from "react-router-dom";

class SidebarButton extends Component {
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
            <div onClick={() => this.setState({redirect: '/home' + this.props.urlPath},
                () => this.setState({redirect: null}))}
                 style={{position: "relative", cursor: 'pointer'}}>
                <ClickableOverlay>
                    <div className={styles.btnWrapper} style={{
                        backgroundColor: this.props.active ? '#23A6BD' : 'transparent'
                    }}>
                        <div style={{display: 'flex', marginLeft: '5px'}}>
                            <img className={styles.btnImg}
                                 src={require('../../images/dashboardSidebar/' + this.props.imgName)}
                                 alt=''
                            />
                            <div style={{marginTop: '1px'}}>
                                {this.props.text}
                            </div>
                        </div>
                    </div>
                </ClickableOverlay>
            </div>
        );
    }
}

export default SidebarButton;
