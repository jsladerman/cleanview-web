import React, {Component} from 'react';
import styles from './css/LocationsTable.module.css';
import LocationBox from "./LocationBox";

class LocationsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div className={styles.flexContainer}>
                {this.renderLocations()}
                <LocationBox locationName='Location #1' rating={3}/>
                <LocationBox locationName='Location #2' rating={3}/>
                <LocationBox locationName='Location #3' rating={3}/>
                <LocationBox locationName='Location #4' rating={3}/>
            </div>
        );
    }

    renderLocations = () => {
        return this.props.locations.map(loc => {
            console.log('here');
            return (
                <LocationBox
                    locationName={loc.loc_name}
                    key={loc.a}
                    rating={3}
                />
            )
        });
    }

}

export default LocationsTable;
