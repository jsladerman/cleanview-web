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
                            <div className={styles.locationText}> {this.props.locationName}</div>
                            <div className={styles.regularText}>
                                <div style={{marginRight:'3px'}}>Current Rating:</div>
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
        let fractionalWidth = 16 * (this.props.rating % 1);
        fractionalWidth = 16 * (fractionalWidth === 0 ? 1 : fractionalWidth);
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
    width: '250px',
    height: 'auto',
    borderRadius: '8px',
    borderWidth: '0',
    flexShrink: '0',
}

export default LocationBox;
