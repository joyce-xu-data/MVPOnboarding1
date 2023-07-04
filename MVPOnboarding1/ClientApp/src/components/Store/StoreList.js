import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import CreateStore from './CreateStore';
import EditStore from './EditStore';
import { generateDeleteWindowContent } from './DeleteStore';

export class StoreList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stores: [],
            loading: true,
            editingStoreId: null,
            editedName: '',
            editedAddress: '',
            error: null,
            showCreatePopup: false,
            showEditWindow: false

        };
        this.handleSave = this.handleSave.bind(this);
    }
    openCreatePopup = () => {
        const createStore = new CreateStore();
        createStore.openCreatePopup();
    };

    openEditWindow = (store) => {

        const { id: storeId, name: storeName, address: storeAddress } = store;
        const editStore = new EditStore();
        editStore.openEditWindow2(storeId, storeName, storeAddress);

    };
    componentDidMount() {
        this.fetchSales();
        this.populateStoreData();
        window.addEventListener('message', this.handlePopupMessage);
    };

    renderStoreTable(stores, handleEdit, handleDelete, handleSave) {
        return (
            <table className="ui celled table" aria-labelledby="tabellabel">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Edit Item</th>
                        <th>Delete Item</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map((store) => (
                        <tr key={store.id}>
                            <td>{store.name}</td>
                            <td>{store.address}</td>
                            <td>
                                <button className="ui button" onClick={() => this.openEditWindow(store)

                                }>
                                    Edit
                                </button>
                            </td>
                            <td>
                                <button className="ui button" onClick={() => handleDelete(store.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    render() {
        const { loading, stores, editingStoreId, error, showEditWindow, editedName, editedAddress } = this.state;
        let contents = loading ? (
            <p>
                <em>Loading...</em>
            </p>
        ) : (
                this.renderStoreTable(stores, this.openEditWindow, this.handleDelete, this.handleSave)
            );
        return (
            <div>
                <h1 id="tabellabel">Store Details</h1>
                <button className="ui button" onClick={this.openCreatePopup}>
                    Create New Store
                </button>
                {contents}
                {error && (
                    <div className="error-popup">
                        <h2>Error</h2>
                        <p>{error}</p>
                        <button onClick={this.hideError}>OK</button>
                    </div>
                )}
                <CreateStore />
                {showEditWindow && editingStoreId && (
                    <EditStore
                        editingStoreId={editingStoreId}
                        editedName={editedName}
                        editedAddress={editedAddress}
                    />
                )}
            </div>
        );
    }

    handlePopupMessage = (event) => {
        const { type, storeId: eventId, name, address } = event.data;
        if (type === 'createStore') {
            this.handleCreateStore(name, address);
        } else if (type === 'updateStore') {

            const updatedStoreData = {
                storeId: eventId,
                name,
                address
            };
            this.handleEdit(updatedStoreData)
            console.log('updated Store data: ', updatedStoreData);
        }
    };

    handleEdit = ({ storeId, name: storeName, address: storeAddress }) => {
        // Store the store ID, name, and address in the component state
        this.setState({
            editingStoreId: storeId,
            editedName: storeName,
            editedAddress: storeAddress,
        }, () => {
            // Call handleSave once the state is updated
            this.handleSave();
        });
    };

    handleSave = async () => {
        const { editingStoreId, editedName, editedAddress } = this.state;

        // Make an API request to update the store with the edited values
        try {
            const response = await fetch(`api/stores/${editingStoreId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editingStoreId,
                    name: editedName,
                    address: editedAddress,
                }),
            });

            if (response.ok) {
                console.log(`Store with ID ${editingStoreId} updated.`);
                this.populateStoreData();

            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to update store.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
            this.setState({ error: error.message });
        }
    };


    handleCreateStore = async (name, address) => {
        // Make an API request to create the store
        try {
            const response = await fetch('api/stores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    address,
                }),
            });

            if (response.ok) {
                console.log('New store created.');
                this.setState({ showCreatePopup: false });
                this.populateStoreData();
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to create store.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
            this.setState({ error: error.message });
        }
    };

    async fetchSales() {
        console.log('Called fetchSales method');
        const response = await fetch('api/sales');
        console.log(response);
        const data = await response.json();
        console.log("fetchSales: ", data);
        this.setState({ sales: data, loading: false });
    }

    handleDelete = async (storeId) => {
        // Open a new window
        const deleteWindow = window.open('', '_blank', 'width=400,height=300');

        // Generate the content for the new window using the separate function
        const deleteWindowContent = generateDeleteWindowContent(storeId);

        // Write the content of the new window
        deleteWindow.document.write(deleteWindowContent);

        // Global function to handle confirmation of deletion in the main window
        window.confirmDeleteStore = (storeId) => {
            this.handleConfirmDelete(storeId);
            window.close();
        };
    };

    handleConfirmDelete = async (storeId) => {

        const dataExist = this.state.sales.find(
            (sales) =>
                sales.storeId === storeId
        );
        if (dataExist) {
            // Open a new window with the popup content
            const popupWindow = window.open('', '_blank', 'width=400,height=200');

            popupWindow.document.write(`
       <html>
          <head>
            <title>Delete Failed</title>
          </head>
          <body>
            <h2>Delete Failed</h2>
            <p>Failed to delete this store. The store may have existing sale records.</p>
            <script>
              setTimeout(() => window.close(), 2000);
            </script>
          </body>
        </html>
    `);

            popupWindow.document.close();
            return {};
        }
        // Make an API request to delete the store
        try {
            const response = await fetch(`api/stores/${storeId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log(`Store with ID ${storeId} deleted.`);
                this.populateStoreData();
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to delete store.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
            this.setState({ error: error.message });
        }
    };


    async populateStoreData() {
        console.log('Called api method');
        const response = await fetch('api/stores');
        console.log(response);
        const data = await response.json();
        console.log(data);
        this.setState({ stores: data, loading: false });
    }

}
export default StoreList;
