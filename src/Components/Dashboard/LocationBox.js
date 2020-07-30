import React, {Component} from 'react';
import styles from './css/LocationBox.module.css';
import Card from 'react-bootstrap/Card'
import ClickableOverlay from "../Custom/ClickableOverlay";
import {Redirect} from "react-router-dom";

class LocationBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            stars: [],
        }
    }

    componentDidMount() {
        this.renderRating();
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect}/>
        }
        const imgSrc = this.props.imageUrl != null ? this.props.imageUrl : require('../../images/exampleRestaurant.png')
        return (
            <div className={styles.outerCard}>
                <Card border='light' style={cardStyle} onClick={this.openLocation}>
                    <ClickableOverlay>
                        <Card.Img variant="top" style={{borderRadius: '8px', height: '160px'}}
                                  src={imgSrc}/>
                        <div className={styles.body}>
                            <div className={styles.flexContainer}>
                                <div className={styles.locationText}> {this.props.locationName}</div>
                                <div className={styles.regularText}> Last Updated:</div>
                            </div>
                            <div className={styles.flexContainer}>
                                <div className={styles.regularText}> Rating: {this.state.stars}</div>
                                <div className={styles.regularText}> date placeholder{this.props.lastUpdated}</div>
                            </div>
                        </div>
                    </ClickableOverlay>
                </Card>
            </div>
        );
    }

    openLocation = () => {
        this.setState({
            redirect:  '/home/locations/' + this.props.id + '/info'
        })
    }

    renderRating = () => {
        const arr = [];
        for (let i = 0; i < this.props.rating; i++) {
            arr.push(<img
                src={require("../../images/star.png")}
                height="16px"
                alt=''
                key={i}
            />);
        }
        this.setState({stars: arr});
    }

}

const cardStyle = {
    width: '250px',
    height: 'auto',
    borderRadius: '8px',
    flexShrink: '0',
}

export default LocationBox;
