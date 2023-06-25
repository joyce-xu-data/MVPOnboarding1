import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import CreateCustomer from './CreateCustomer';
import EditCustomer from './EditCustomer';
import { generateDeleteWindowContent } from './DeleteCustomer';

export class CustomerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            loading: true,
            editingCustomerId: null,
            editedName: '',
            editedAddress: '',
            error: null,
            showCreatePopup: false,

        };
        this.handleSave = this.handleSave.bind(this);
    }
    openCreatePopup = () => {
        const createCustomer = new CreateCustomer();
        createCustomer.openCreatePopup();
    };

    componentDidMount() {
        this.populateCustomerData();
        window.addEventListener('message', this.handlePopupMessage);
    }

    static renderCustomerTable(customers, handleEdit, handleDelete, handleSave) {
        return (
            <table className="ui celled table" aria-labelledby="tabellabel">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Edit Customer</th>
                        <th>Delete Customer</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.name}</td>
                            <td>{customer.address}</td>
                            <td>
                                <button className="ui button" onClick={() => handleEdit(customer.id, customer.name, customer.address)}>
                                    Edit
                                </button>
                            </td>
                            <td>
                                <button className="ui button" onClick={() => handleDelete(customer.id)}>
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
        const { loading, customers, editingCustomerId, error } = this.state;
        let contents = loading ? (
            <p>
                <em>Loading...</em>
            </p>
        ) : (
                CustomerList.renderCustomerTable(customers, this.handleEdit, this.handleDelete)
            );
        return (
            <div>
                <h1 id="tabellabel">Customer Details</h1>
                <button className="ui button" onClick={this.openCreatePopup}>
                    Create New Customer
                </button>
                {contents}
                {error && (
                    <div className="error-popup">
                        <h2>Error</h2>
                        <p>{error}</p>
                        <button onClick={this.hideError}>OK</button>
                    </div>
                )}
                <CreateCustomer />
                {editingCustomerId && (
                    <EditCustomer
                        customerId={editingCustomerId}
                        customerName={this.state.editedName}
                        customerAddress={this.state.editedAddress}
                    />

                )}

            </div>
        );
    }

    handlePopupMessage = (event) => {
        const { type, name, address } = event.data;
        if (type === 'createCustomer') {
            this.handleCreateCustomer(name, address);
        }
    };

    handleCreateCustomer = async (name, address) => {
        // Make an API request to create the customer
        try {
            const response = await fetch('api/customers', {
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
                console.log('New customer created.');
                this.setState({ showCreatePopup: false });
                this.populateCustomerData();
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to create customer.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
            this.setState({ error: error.message });
        }
    };

    handleEdit = (customerId, customerName, customerAddress) => {
        // Store the customer ID, name, and address in the component state
        this.setState({
            editingCustomerId: customerId,
            editedName: customerName,
            editedAddress: customerAddress,
        });


        // Global 
        window.updateEditedName = (value) => {
            this.setState({ editedName: value });
        };

        window.updateEditedAddress = (value) => {
            this.setState({ editedAddress: value });
        };

        window.saveEditedCustomer = (customerId) => {
            this.handleSave(customerId);
        };
    };

    handleDelete = async (customerId) => {
        // Open a new window
        const deleteWindow = window.open('', '_blank', 'width=400,height=300');

        // Generate the content for the new window using the separate function
        const deleteWindowContent = generateDeleteWindowContent(customerId);

        // Write the content of the new window
        deleteWindow.document.write(deleteWindowContent);

        // Global function to handle confirmation of deletion in the main window
        window.confirmDeleteCustomer = (customerId) => {
            this.handleConfirmDelete(customerId);
            window.close();
        };
    };

    handleConfirmDelete = async (customerId) => {
        // Make an API request to delete the customer
        try {
            const response = await fetch(`api/customers/${customerId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log(`Customer with ID ${customerId} deleted.`);
                this.populateCustomerData();
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to delete customer.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
            this.setState({ error: error.message });
        }
    };

    handleSave = async () => {
        const { editingCustomerId, editedName, editedAddress } = this.state;

        // Make an API request to update the customer with the edited values
        try {
            const response = await fetch(`api/customers/${editingCustomerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editingCustomerId,
                    name: editedName,
                    address: editedAddress,
                }),
            });

            if (response.ok) {
                console.log(`Customer with ID ${editingCustomerId} updated.`);
                this.populateCustomerData();
                // You may want to update the state or refresh the customer list
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to update customer.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
            this.setState({ error: error.message });
        }

        this.handleCancelEdit(); // Call handleCancelEdit instead of recursively calling handleSave
    };

    handleCancelEdit = () => {
        this.setState({ editingCustomerId: null, editedName: '', editedAddress: '' });
    };
    async populateCustomerData() {
        console.log('Called api method');
        const response = await fetch('api/customers');
        console.log(response);
        const data = await response.json();
        console.log(data);
        this.setState({ customers: data, loading: false });
    }

}
export default CustomerList;
