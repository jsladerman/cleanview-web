import React, { Component } from 'react';
import { API } from 'aws-amplify';
import Auth from "@aws-amplify/auth";


// Lists all Locations
class ManagedLocationList extends Component {
    async getData() {
        const apiName = 'ManageLocationAPI'; // replace this with your api name.
        const path = '/manageLocation/:manager'; //replace this with the path you have configured on your API
        const myParams = {
            headers: {},
            response: true,
            queryStringParameters: {
                manager: 'testUser',
            },
        };

        await API.get(apiName, path, myParams)
        .then(response => console.log(response))
        .catch(error => {
            console.log(error)
        })
    }
    render() {
        return(
        <button onClick={this.getData}>
            Hello
        </button>
    );
    }
}

export default ManagedLocationList;