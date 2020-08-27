import React, { Component } from 'react';
import styles from './css/MenuManager.module.css';
import { API } from 'aws-amplify';
import uuid from 'react-uuid';
import Modal from "@trendmicro/react-modal";

import MenuTable from "./MenuManager/MenuTable";
import AddNewMenu from "./MenuManager/AddNewMenu";
import DeleteMenu from "./MenuManager/DeleteMenu";
import EditMenu from './MenuManager/EditMenu'


class MenuManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            switchVal: 'pdf',
            menus: [],
            showModal: false,
            editingMenu: {}
        }
    }

    componentDidMount() {
        this.updateDataFromDB()
    }

    render() {
        return (
            <div>
                <Modal
                    show={this.state.showModal}
                    onClose={this.toggleModal}
                    showCloseButton={true}
                    style={{ borderRadius: "100px" }}
                >
                    <EditMenu 
                        currentMenus={this.state.menus}
                        menu={this.state.editingMenu}
                        updateFunc={this.updateMenus}
                        toggleFunc={this.toggleModal}
                    />
                </Modal>
                <div className='container-fluid text-wrap' id={styles.menuManagerCodeBlock}>
                    <h2 id={styles.menuManagerHeader}>Menu Manager</h2>
                    <h4 className={styles.menuManagerSubheader}>Add a new menu</h4>
                    <AddNewMenu 
                        submitFunc={this.addMenu} 
                        id={this.props.id} 
                        menus={this.state.menus}
                    />
                    <h4 className={styles.menuManagerSubheader}>Current Menus</h4>
                    <MenuTable 
                        menus={this.state.menus} 
                        loading={this.state.loading} 
                        toggleFunc={this.toggleModal} 
                        setIdFunc={this.setEditId}
                    />
                    <h4 className={styles.menuManagerSubheader}>Delete Menu</h4>
                    <DeleteMenu 
                        menus={this.state.menus} 
                        deleteFunc={this.deleteMenu}
                    />
                </div>
            </div>
        )
    }

    setEditId = (id) => {
        console.log(id)
        const currentMenus = this.state.menus
        for(let i=0; i<currentMenus.length; ++i) {
            console.log(currentMenus[i])
            if(currentMenus[i].id === id)
                this.setState({ editingMenu: currentMenus[i]})
        }
    }
    
    toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal
        })
    }

    deleteMenu = (menuName) => {
        if (!window.confirm("Are you sure you want to delete this menu?"))
            return
        let currentMenus = this.state.menus
        for (let i = 0; i < currentMenus.length; ++i) {
            if (currentMenus[i].name === menuName) {
                currentMenus.splice(i, 1)
                break
            }
        }
        this.updateMenus(currentMenus)
    }

    updateDataFromDB = () => {
        const apiName = 'ManageLocationApi';
        const path = '/location/object'
        const requestData = {
            headers: {},
            response: true,
            queryStringParameters: {
                id: this.props.id
            }
        }

        API.get(apiName, path, requestData)
            .then(response => {
                if (!response.data.body.menus)
                    return

                let currState = this.state
                currState.menus = response.data.body.menus
                this.setState(currState)
            })
            .catch(error => {
                console.log("Error: " + error)
            });

        this.setState({loading: false})
    }


    addMenu = (newMenuName, newMenuLink) => {
        let currentMenus = this.state.menus
        let newMenu = {
            name: newMenuName,
            url: newMenuLink,
            id: uuid()
        }
        currentMenus.push(newMenu)
        this.updateMenus(currentMenus)
    }

    updateMenus = (currentMenus) => {
        const apiName = 'ManageLocationApi'
        const path = '/location/menu'
        const requestData = {
            headers: {},
            response: true,
            body: {
                menus: currentMenus,
                id: this.props.id
            }
        }

        this.setState({loading: true})
        API.patch(apiName, path, requestData)
            .then(response => {
                this.updateDataFromDB()
                this.props.handleUpdate()
            })
            .catch(error => {
                console.log("Error: ", error)
                this.setState({loading: false})
            })
    }
}

export default MenuManager;
