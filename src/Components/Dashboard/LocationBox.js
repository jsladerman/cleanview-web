import React, {Component} from 'react';
import styles from './css/LocationBox.module.css';
import Card from 'react-bootstrap/Card'
import ClickableOverlay from "../Custom/ClickableOverlay";

class LocationBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stars: [],
        }
    }

    componentDidMount() {
        this.renderRating();
    }

    render() {
        return (
            <div className={styles.outerCard}>
                <Card border='light' style={cardStyle} onClick={this.openLocation}>
                    <ClickableOverlay>
                        <Card.Img variant="top" style={{borderRadius: '8px'}}
                                  src={require('../../images/exampleRestaurant.png')}/>
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
        const name = this.props.locationName;
        alert(name);
    }

    renderRating = () => {
        const arr = [];
        for (let i = 0; i < this.props.rating; i++) {
            arr.push(<img
                src={require("../../images/star.png")}
                height="16px"
                key={i}
            />);
        }
        this.setState({stars: arr});
    }

}

const cardStyle = {
    width: '250px',
    height: 'auto',
    overflow: 'scroll',
    borderRadius: '8px',
    flexShrink: '0',
}

export default LocationBox;
