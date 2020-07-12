import React, { Component } from 'react';
import { API } from 'aws-amplify';
import Auth from "@aws-amplify/auth";
import ManagedLocationListItem from './ManagedLocationListItem'
import AddLocation from './AddLocation'


// Lists all Locations
class ManagedLocationList extends Component {
    constructor() {
        super();
        this.state = {
            locations: [],
        }
    }

    componentWillMount() {
        this.getData()
    }

    async getData() {
        let user = await Auth.currentUserInfo()
        console.log(user.username)

        const apiName = 'manageLocationApi'; // replace this with your api name.
        const path = '/manageLocation'; //replace this with the path you have configured on your API
        const myParams = {
            headers: {},
            response: true,
            queryStringParameters: {
                manager: user.username
            },
        };

        await API.get(apiName, path, myParams)
        .then(response => {
            this.setState({
                locations: response["data"],
            })
            console.log(this.state.locations)
        })
        .catch(error => {
            console.log(error)
        })
    }

    render() {
        let locationItems;
        if(this.state.locations.length > 0) {
            locationItems = this.state.locations.map(loc => {
                return(
                    <ManagedLocationListItem 
                        key = {loc.id}
                        name = {loc.loc_name}
                        city = {loc.addr_city}
                        manager = {loc.manager}
                        cleaning_practices = {loc.cleaning_practices}
                    />
                )
            })
        }
        return(
            <div className="Location List">
            <h3>All Locations</h3>
                {locationItems}
            <AddLocation />
            </div>
    );
    }
}

export default ManagedLocationList;