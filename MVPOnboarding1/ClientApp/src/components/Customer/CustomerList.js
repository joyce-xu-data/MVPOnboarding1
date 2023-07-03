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
            showEditWindow: false

        };
    //    this.handleSave = this.handleSave.bind(this);
    //}
    openCreatePopup = () => {
        const createCustomer = new CreateCustomer();
        createCustomer.openCreatePopup();
    };

    openEditWindow = (customer) => {
        const { id: customerId, name: customerName, address: customerAddress } = customer;
        const editCustomer = new EditCustomer();
        editCustomer.openEditWindow2(customerId, customerName, customerAddress);

        console.log("openEditWindow2")

    };

    //openEditWindow = (customerId, customerName, customerAddress) => {
    //    this.setState({
    //        editingCustomerId: customerId,
    //        editedName: customerName,
    //        editedAddress: customerAddress,
    //        showEditWindow: true
    //    });

    //    console.log("openEditWindow")
    //};

    componentDidMount() {
        console.log("component did mount - parent")
        this.fetchSales();
        this.populateCustomerData();
        window.addEventListener('message', this.handlePopupMessage);
    }

    renderCustomerTable(customers, handleEdit, handleDelete, handleSave) {
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
                                <button className="ui button" onClick={() => this.openEditWindow(customer)

                                }>
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
            </table >
        );
    }

    render() {
        const { loading, customers, editingCustomerId, error, showEditWindow, editedName, editedAddress } = this.state;
        let contents = loading ? (
            <p>
                <em>Loading...</em>
            </p>
        ) : (
                this.renderCustomerTable(customers, this.openEditWindow, this.handleDelete, this.handleSave)
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
                {showEditWindow && editingCustomerId && (
                    <EditCustomer
                        //customerId={editingCustomerId}
                        //customerName={editedName}
                        //customerAddress={editedAddress}
                        //onSave={this.handleSave}
                        //onCancel={this.handleCancelEdit}
                        editingCustomerId={editingCustomerId}
                        editedName={editedName}
                        editedAddress={editedAddress}
                        onSave={this.handleSave}
                        //onCancel={this.handleCancelEdit}

                    />

                )}

            </div>
        );
    }

    handlePopupMessage = (event) => {

        const { type, customerId: eventId, name, address } = event.data;
        if (type === 'createCustomer') {
            this.handleCreateCustomer(name, address);
            console.log("handlecreatecust", eventId)
        } else if (type === 'updateCustomer') {

            const updatedCustomerData = {
                customerId: eventId,
                name,
                address
            };
            console.log("type:", type, "id:", eventId)
            this.handleEdit(updatedCustomerData)
            console.log('updated customer data: ', updatedCustomerData);
        }
    };

    handleEdit = ({ customerId, name: customerName, address: customerAddress }) => {
        console.log("HandleEDIT", customerId, customerName, customerAddress)
        // Store the customer ID, name, and address in the component state
        this.setState({
            editingCustomerId: customerId,
            editedName: customerName,
            editedAddress: customerAddress,

        }, () => {
            // Call handleSave once the state is updated
            this.handleSave();
        });
    };

    handleSave = async () => {
        const { editingCustomerId, editedName, editedAddress } = this.state;
        console.log(editingCustomerId, editedName, editedAddress)

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
                address:editedAddress
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

    //this.handleCancelEdit(); // Call handleCancelEdit instead of recursively calling handleSave
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


    async fetchSales() {
        console.log('Called fetchSales method');
        const response = await fetch('api/sales');
        console.log(response);
        const data = await response.json();
        console.log("fetchSales: ", data);
        this.setState({ sales: data, loading: false });
    }

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
        console.log('customerId:', customerId);
        console.log('this.state.sales:', this.state.sales);
        const dataExist = this.state.sales.find(
            (sales) =>
                sales.customerId === customerId
        );
        if (dataExist) {
            console.log(
                "Failed to delete this customer. The customer may have existing sale records.",
            );

            // Open a new window with the popup content
            const popupWindow = window.open('', '_blank', 'width=400,height=200');

            popupWindow.document.write(`
       <html>
          <head>
            <title>Delete Failed</title>
            <link rel="stylesheet" type="text/css" href="/Customer/Popup.css">
          </head>
          <body>
            <h2>Delete Failed</h2>
            <p>Failed to delete this customer. The customer may have existing sale records.</p>
            <script>
              setTimeout(() => window.close(), 2000);
            </script>
          </body>
        </html>
    `);

            popupWindow.document.close();
            return {};
        }
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


    //handleCancelEdit = () => {
    //    this.setState({ editingCustomerId: null, editedName: '', editedAddress: '' });
    //};

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