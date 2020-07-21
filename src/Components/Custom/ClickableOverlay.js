import React, {Component} from 'react';
import styles from './css/ClickableOverlay.module.css';

// Overlay will be applied to the nearest non-static parent
class ClickableOverlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            press: false
        }
    }

    render() {
        return (
            <div className={styles.disableHighlights}
                 onMouseEnter={this.hoverOn}
                 onMouseLeave={this.hoverOff}
                 onMouseDown={this.togglePress} onMouseUp={this.togglePress}>
                <div className={styles.clickableOverlay}
                     style={{
                         backgroundColor: this.setOverlay(),
                         borderRadius: this.props.borderRadius
                     }}/>
                {this.props.children}
            </div>
        );
    }

    hoverOn = () => {
        this.setState({hover: true, press: false})
    }

    hoverOff = () => {
        this.setState({hover: false, press: false})
    }

    togglePress = () => {
        this.setState({press: !this.state.press})
    }

    setOverlay = () => {
        if (this.state.press)
            return 'rgba(0,0,0,0.1)'
        else if (this.state.hover)
            return 'rgba(255,255,255,0.1)';
        else
            return 'rgba(0,0,0,0)'
    }

}

export default ClickableOverlay;
