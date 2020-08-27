import React, {Component} from 'react';
import Table from 'react-bootstrap/Table'
import Button from "react-bootstrap/Button"

class MenuTable extends Component {
    render() {
        if (this.props.loading) {
            return (
                <div>Loading...</div>
            );
        }
        if (this.props.menus.length === 0)
            return (
                <div>
                    <h5>You don't have any menus right now :)</h5>
                </div>
            );

        return (
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>
                        Name
                    </th>
                    <th>
                        Link
                    </th>
                    <th>
                    </th>
                </tr>
                </thead>
                <tbody>
                {this.props.menus.map((menu) => {
                    return (
                        <tr key={menu.name}>
                            <td>
                                {menu.name}
                            </td>
                            <td>
                                <a href={menu.url} target="_blank" rel="noopener noreferrer">{menu.url}</a>
                            </td>
                            <td>
                                <Button onClick={() => {
                                    this.props.setIdFunc(menu.id)
                                    this.props.toggleFunc()
                                }}>Edit</Button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </Table>
        );
    }
}

export default MenuTable;
