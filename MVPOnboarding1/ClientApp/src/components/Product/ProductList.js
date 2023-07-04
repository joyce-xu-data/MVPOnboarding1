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
            showEditWindow: false

        };
        this.handleSave = this.handleSave.bind(this);
    }
    openCreatePopup = () => {
        const createProduct = new CreateProduct();
        createProduct.openCreatePopup();
    };

    openEditWindow = (product) => {
        console.log(product)
        const { id: productId, name: productName, price: productPrice } = product;
        const editProduct = new EditProduct();
        editProduct.openEditWindow2(productId, productName, productPrice);

        console.log(productId, productName, productPrice)

    };

    componentDidMount() {
        this.fetchSales();
        this.populateProductData();
        window.addEventListener('message', this.handlePopupMessage);
    }


    renderProductTable(products, handleEdit, handleDelete, handleSave) {
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
                                        <button className="ui button" onClick={() => this.openEditWindow(product)

                                }>
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
        const { loading, products, editingProductId, error, showEditWindow, editedName, editedPrice } = this.state;
        let contents = loading ? (
            <p>
                <em>Loading...</em>
            </p>
        ) : (
                this.renderProductTable(products, this.openEditWindow, this.handleDelete)
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
                {showEditWindow && editingProductId && (
                    <EditProduct
                        editingProductId={editingProductId}
                        editedName={editedName}
                        editedPrice={editedPrice}
                    //onSave{this.handleSave}
                    />
                )}
            </div>
        );
    }


    handlePopupMessage = (event) => {
        const { type, productId: eventId, name, price } = event.data;
        if (type === 'createProduct') {
            this.handleCreateProduct(name, price);
        } else if (type === 'updateProduct') {

            const updatedProductData = {
                productId: eventId,
                name,
                price
            };
            console.log("type:", type, "id:", eventId)
            this.handleEdit(updatedProductData)
            console.log('updated Product data: ', updatedProductData);
        }
    };

    handleEdit = ({ productId, name: productName, price: productPrice }) => {
        // Store the product ID, name, and price in the component state
        this.setState({
            editingProductId: productId,
            editedName: productName,
            editedPrice: productPrice,
        }, () => {
            // Call handleSave once the state is updated
            this.handleSave();
        });
    };

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

        //    this.handleCancelEdit(); // Call handleCancelEdit instead of recursively calling handleSave
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

    async fetchSales() {
        console.log('Called fetchSales method');
        const response = await fetch('api/sales');
        console.log(response);
        const data = await response.json();
        console.log("fetchSales: ", data);
        this.setState({ sales: data, loading: false });
    }

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
        const dataExist = this.state.sales.find(
            (sales) =>
                sales.productId === productId
        );
        if (dataExist) {

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
            <p>Failed to delete this product. The product may have existing sale records.</p>
            <script>
              setTimeout(() => window.close(), 2000);
            </script>
          </body>
        </html>
    `);

            popupWindow.document.close();
            return {};
        }
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

}
export default ProductList;