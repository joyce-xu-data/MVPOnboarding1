import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import CreateProduct from './CreateProduct';
import EditProduct from './EditProduct';
import { generateDeleteWindowContent } from './DeleteProduct';




export class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            loading: true,
            editingProductId: null,
            editedName: '',
            editedPrice: '',
            error: null,
            showCreatePopup: false,

        };
        this.handleSave = this.handleSave.bind(this);
    }
    openCreatePopup = () => {
        const createProduct = new CreateProduct();
        createProduct.openCreatePopup();
    };

    componentDidMount() {
        this.populateProductData();
        window.addEventListener('message', this.handlePopupMessage);
    }


    static renderProductTable(products, handleEdit, handleDelete, handleSave) {
        return (
            <table className="ui celled table" aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price($)</th>
                        <th>Edit Item</th>
                        <th>Delete Item</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.price.toFixed(2)}</td>
                            <td>
                                <button className="ui button" onClick={() => handleEdit(product.id, product.name, product.price)}>
                                    Edit
                                </button>
                            </td>
                            <td>
                                <button className="ui button" onClick={() => handleDelete(product.id)}>
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
        const { loading, products, editingProductId, error } = this.state;

        let contents = loading ? (
            <p>
                <em>Loading...</em>
            </p>
        ) : (
                ProductList.renderProductTable(products, this.handleEdit, this.handleDelete)
            );

        return (
            <div>
                <h1 id="tabelLabel">Product Details</h1>
                <button className="ui button" onClick={this.openCreatePopup}>
                    Create New Product
        </button>
                {contents}
                {error && (
                    <div className="error-popup">
                        <h2>Error</h2>
                        <p>{error}</p>
                        <button onClick={this.hideError}>OK</button>
                    </div>
                )}
                <CreateProduct />
                {editingProductId && (
                    <EditProduct
                        productId={editingProductId}
                        productName={this.state.editedName}
                        productPrice={this.state.editedPrice}
                    />
                )}
            </div>
        );
    }


    handlePopupMessage = (event) => {
        const { type, name, price } = event.data;

        if (type === 'createProduct') {
            this.handleCreateProduct(name, price);
        }
    };



    handleCreateProduct = async (name, price) => {

        // Make an API request to create the product
        try {
            const response = await fetch('api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    price,
                }),
            });

            if (response.ok) {
                console.log('New product created.');
                this.setState({ showCreatePopup: false });
                this.populateProductData();
                window.alert('Product created successfully!');
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to create product.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
            this.setState({ error: error.message });
        }
    };


    handleEdit = (productId, productName, productPrice) => {
        // Store the product ID, name, and price in the component state
        this.setState({
            editingProductId: productId,
            editedName: productName,
            editedPrice: productPrice,
        });


        // Global 
        window.updateEditedName = (value) => {
            this.setState({ editedName: value });
        };

        window.updateEditedPrice = (value) => {
            this.setState({ editedPrice: value });
        };

        window.saveEditedProduct = (productId) => {
            this.handleSave(productId);
        };
    };


    handleDelete = async (productId) => {
        // Open a new window
        const deleteWindow = window.open('', '_blank', 'width=400,height=300');

        // Generate the content for the new window using the separate function
        const deleteWindowContent = generateDeleteWindowContent(productId);

        // Write the content of the new window
        deleteWindow.document.write(deleteWindowContent);

        // Global function to handle confirmation of deletion in the main window
        window.confirmDeleteProduct = (productId) => {
            this.handleConfirmDelete(productId);
            window.close();
        };
    };


    handleConfirmDelete = async (productId) => {
        // Make an API request to delete the product
        try {
            const response = await fetch(`api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log(`Product with ID ${productId} deleted.`);
                this.populateProductData();
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to delete product.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
            this.setState({ error: error.message });
        }
    };


    async populateProductData() {
        console.log('Called api method');
        const response = await fetch('api/products');
        console.log(response);
        const data = await response.json();
        console.log(data);
        this.setState({ products: data, loading: false });
    }

    handleSave = async () => {
        const { editingProductId, editedName, editedPrice } = this.state;

        // Make an API request to update the product with the edited values
        try {
            const response = await fetch(`api/products/${editingProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editingProductId,
                    name: editedName,
                    price: editedPrice,
                }),
            });

            if (response.ok) {
                console.log(`Product with ID ${editingProductId} updated.`);
                this.populateProductData();
                // You may want to update the state or refresh the product list
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to update product.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
            this.setState({ error: error.message });
        }

        this.handleCancelEdit(); // Call handleCancelEdit instead of recursively calling handleSave
    };

    handleCancelEdit = () => {
        this.setState({ editingProductId: null, editedName: '', editedPrice: '' });
    };
}





export default ProductList;