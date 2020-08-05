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

    // Example props
    // locationName={loc.loc_name}
    // city={loc.addrCity}
    // street={loc.addrLine1}
    // key={loc.id + 'key'}
    // imageUrl={loc.imageUrl}
    // id={loc.id}
    // rating={0}

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
                        <Card.Img variant="top" style={{borderRadius: '8px', height: '192px'}}
                                  src={imgSrc}/>
                        <div className={styles.body}>
                            <div className={styles.locationText}>{this.props.locationName} - {this.props.city}</div>
                            <div className={styles.regularText}>{this.props.street}</div>
                            <div className={styles.regularText}>
                                {/* <div style={{marginRight:'3px'}}>Current Rating:</div> */}
                                {this.state.stars}
                            </div>
                        </div>
                    </ClickableOverlay>
                </Card>
            </div>
        );
    }

    openLocation = () => {
        this.setState({
            redirect: '/home/locations/' + this.props.id + '/info'
        })
    }

    renderRating = () => {
        const arr = [];
        const starImg = require('../../images/star.svg');
        const ratingFraction = this.props.rating % 1;
        let fractionalWidth = 16 * (ratingFraction === 0 ? 1 : ratingFraction);
        fractionalWidth = (this.props.rating !== 0 ? fractionalWidth : 0);
        for (let i = 0; i < this.props.rating - 1; i++) {
            arr.push(<div key={i} style={{
                backgroundImage: 'url(' + starImg + ')',
                height: '16px',
                width: '16px',
                marginTop: '3px'
            }}/>);
        }
        arr.push(<div key={this.props.rating} style={{
            backgroundImage: 'url(' + starImg + ')',
            height: '16px',
            width: fractionalWidth,
            marginTop: '3px',
        }}/>);
        this.setState({stars: arr});
    }

}

const cardStyle = {
    width: '300px',
    height: 'auto',
    borderRadius: '8px',
    borderWidth: '0',
    flexShrink: '0',
}

export default LocationBox;
