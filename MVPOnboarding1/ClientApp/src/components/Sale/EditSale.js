import React, { Component } from 'react';

class EditSale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerName: props.customerName,
            productName: props.productName,
            storeName: props.storeName,
            dateSold: props.dateSold,
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSave = () => {
        const { saleId, onSave } = this.props;
        const { customerName, productName, storeName, dateSold } = this.state;

        // Perform save operation or API call here with updated data
        // ...

        onSave(saleId, { customerName, productName, storeName, dateSold });
    };

    render() {
        const { customerName, productName, storeName, dateSold } = this.state;

        return (
            <div>
                <h3>Edit Sale</h3>
                <div>
                    <label>Customer Name:</label>
                    <input type="text" name="customerName" value={customerName} onChange={this.handleInputChange} />
                </div>
                <div>
                    <label>Product Name:</label>
                    <input type="text" name="productName" value={productName} onChange={this.handleInputChange} />
                </div>
                <div>
                    <label>Store Name:</label>
                    <input type="text" name="storeName" value={storeName} onChange={this.handleInputChange} />
                </div>
                <div>
                    <label>Date Sold:</label>
                    <input type="text" name="dateSold" value={dateSold} onChange={this.handleInputChange} />
                </div>
                <button onClick={this.handleSave}>Save</button>
            </div>
        );
    }
}

export default EditSale;
