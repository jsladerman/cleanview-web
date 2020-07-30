import React, {Component} from 'react';
import styles from './css/LocationsTable.module.css';
import LocationBox from "./LocationBox";
import Modal from "@trendmicro/react-modal";
import AddLocation from "./AddLocation";
import ClickableOverlay from "../Custom/ClickableOverlay";

class LocationsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        }
    }

    render() {
        return (
            <div>
                <Modal show={this.state.showModal}
                       onClose={this.toggleModal}
                       showCloseButton={false}
                       style={{borderRadius: '100px'}}>
                    <AddLocation modalFunc={() => {
                                this.toggleModal();
                                this.props.getDataFunc();
                            }}
                        backendEnv={this.props.backendEnv}
                    />
                </Modal>
                <div className={styles.dashboardHeader}>
                    <h1 className={styles.dashboardHeaderText}>{this.props.managerName + '\'s Locations'}</h1>
                    <div className={styles.addLocationButtonDiv} onClick={this.toggleModal}>
                        <ClickableOverlay borderRadius='12px'>
                            <img className={styles.addLocationButton}
                                 src={require("../../images/addLocationButton.png")} alt='Add Location'/>
                        </ClickableOverlay>
                    </div>
                </div>
                <div className={styles.flexContainer}>
                    {this.renderLocations()}
                </div>
            </div>

        );
    }

    renderLocations = () => {
        if (this.props.locations && this.props.locations.length > 0)
            return this.props.locations.map(loc => {
                return (
                    <LocationBox
                        locationName={loc.loc_name}
                        key={loc.id + 'key'}
                        imageUrl={loc.imageUrl}
                        id={loc.id}
                        rating={3.5}
                    />
                )
            });
        else
            return null;
    }

    toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal
        });
    };

}

export default LocationsTable;
