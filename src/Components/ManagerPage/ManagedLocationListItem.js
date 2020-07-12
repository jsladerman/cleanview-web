import React, { Component } from 'react';

class ManagedLocationListItem extends Component {
    render() {
        return(
            <div>
                <h1>{this.props.name}</h1>
                <h2>{this.props.city}</h2>
                <h2>{this.props.manager}</h2>
                <h2>{this.props.cleaning_practices["dining_in"] ? "Full dining" : "Takeout only."}</h2>
            </div>
        );
    }
}

export default ManagedLocationListItem;

