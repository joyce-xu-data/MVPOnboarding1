import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import CreateSale from './CreateSale';
import EditSale from './EditSale';
import { generateDeleteWindowContent } from './DeleteSale';
import CustomerList from '../Customer/CustomerList';
import ProductList from '../Product/ProductList';
import StoreList from '../Store/StoreList';

export class SaleList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sales: [],
            loading: true,
            editingSaleId: null,
            editedCustomerName: '',
            editedProductName: '',
            editedStoreName: '',
            editedDateSold: '',
            error: null,
            showCreatePopup: false,
            customers: [],
            products: [],
            stores: [],
        };
        this.handleSave = this.handleSave.bind(this);
    }

    openCreatePopup = () => {
        this.setState({ showCreatePopup: true });
    };

    closeCreatePopup = () => {
        this.setState({ showCreatePopup: false });
    };

    componentDidMount() {
        this.populateSaleData();
        window.addEventListener('message', this.handlePopupMessage);
    }

    render() {
        const {
            loading,
            sales,
            editingSaleId,
            editedCustomerName,
            editedProductName,
            editedStoreName,
            editedDateSold,
            customers,
            products,
            stores,
        } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        return (
            <div>
                <h2>Sales</h2>

                <CreateSale sale={{ customers, products, stores }} handleCreateSale={this.handleCreateSale} />

                <table className="ui celled table" aria-labelledby="tabellabel">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Product Name</th>
                            <th>Store Name</th>
                            <th>Date Sold</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((sale) => (
                            <tr key={sale.id}>
                                <td>{sale.customerName}</td>
                                <td>{sale.productName}</td>
                                <td>{sale.storeName}</td>
                                <td>{sale.dateSold ? new Date(sale.dateSold).toLocaleDateString('en-UK', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</td>
                                <td>
                                    <button className="ui button" onClick={() => this.handleEdit(sale.id, sale.customerName, sale.productName, sale.storeName, sale.dateSold)}>Edit</button>
                                    <button className="ui button" onClick={() => this.handleDelete(sale.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {editingSaleId && (
                    <EditSale
                        sale={{
                            customers,
                            products,
                            stores,
                        }}
                        saleId={editingSaleId}
                        customerName={this.state.editedCustomerName}
                        productName={this.state.editedProductName}
                        storeName={this.state.editedStoreName}
                        dateSold={this.state.editedDateSold}
                        onSave={this.handleSave}
                    />

                )}
            </div>
        );
    }

    handlePopupMessage = (event) => {
        const { type, customerName, productName, storeName, dateSold } = event.data;
        if (type === 'createSale') {
            const newSale = {
                id: this.state.sales.length + 1,
                customerName,
                productName,
                storeName,
                dateSold,
            };
            this.handleCreateCustomer(newSale);
        } else if (type === 'cancelCreateSale') {
            this.closeCreatePopup();
        }
    };

    handleCreateCustomer = async (saleData) => {
        // Make an API request to create the customer
        try {
            const response = await fetch('api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saleData),
            });

            if (response.ok) {
                console.log('New sale created.');
                this.setState({ showCreatePopup: false });
                this.populateSaleData();
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to create sale.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
            this.setState({ error: error.message });
        }
    };

    handleEdit = (saleId, customerName, productName, storeName, dateSold) => {
        this.setState({
            editingSaleId: saleId,
            editedCustomerName: customerName,
            editedProductName: productName,
            editedStoreName: storeName,
            editedDateSold: dateSold,
        });

        // Global 
        window.updateEditedCustomerName = (value) => {
            this.setState({ editedCustomerName: value });
        };

        window.updateEditedProductName = (value) => {
            this.setState({ editedProductName: value });
        };

        window.updateEditedStoreName = (value) => {
            this.setState({ editedStoreName: value });
        };

        window.updateEditedDateSold = (value) => {
            this.setState({ editedDateSold: value });
        };

        window.saveEditedDateSold = (saleId) => {
            this.handleSave(saleId);
        };
    };

    handleDelete = async (saleId) => {
        // Open a new window
        const deleteWindow = window.open('', '_blank', 'width=400,height=300');

        // Generate the content for the new window using the separate function
        const deleteWindowContent = generateDeleteWindowContent(saleId);

        // Write the content of the new window
        deleteWindow.document.write(deleteWindowContent);

        // Global function to handle confirmation of deletion in the main window
        window.confirmDeleteSale = (saleId) => {
            this.handleConfirmDelete(saleId);
            window.close();
        };
    };

    handleConfirmDelete = async (saleId) => {
        // Make an API request to delete the sale
        try {
            const response = await fetch(`api/sales/${saleId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log(`Sale with ID ${saleId} deleted.`);
                this.populateSaleData();
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to delete sale.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
            this.setState({ error: error.message });
        }
    };

    handleSave = async (saleId) => {
        const {
            editedCustomerName,
            editedProductName,
            editedStoreName,
            editedDateSold,
        } = this.state;

        // Make an API request to update the sale with the edited values
        try {
            const response = await fetch(`api/sales/${saleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: saleId,
                    customerName: editedCustomerName,
                    productName: editedProductName,
                    storeName: editedStoreName,
                    dateSold: editedDateSold,
                }),
            });

            if (response.ok) {
                console.log(`Sale with ID ${saleId} updated.`);
                this.populateSaleData();
                // You may want to update the state or refresh the sale list
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to update sale.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
            this.setState({ error: error.message });
        }

        this.handleCancelEdit();
    };


    handleCancelEdit = () => {
        this.setState({ editingSaleId: null, editedCustomerName: '', editedProductName: '', editedStoreName: '', editedDateSold: '' });
    };

    async populateSaleData() {
        try {
            const response = await fetch('api/sales');
            const data = await response.json();
            this.setState({ sales: data, loading: false });

            const customerResponse = await fetch('api/customers');
            const productResponse = await fetch('api/products');
            const storeResponse = await fetch('api/stores');

            const customerData = await customerResponse.json();
            const productData = await productResponse.json();
            const storeData = await storeResponse.json();

            this.setState({
                customers: customerData,
                products: productData,
                stores: storeData,
            });
        } catch (error) {
            this.setState({ error: error.message });
        }
    }
}

export default SaleList;