import React, { Component } from 'react';

class CreateSale extends Component {
    componentDidMount() {
        window.addEventListener('message', this.handlePopupMessage);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handlePopupMessage);
    }

    openCreatePopup = () => {
        const createPopupWindow = window.open('', '_blank', 'width=400,height=500');

        createPopupWindow.document.write(`
      <html>
        <head>
          <title>Create New Sale</title>
          <style>
            ${`
              /* Additional custom styles for the create popup window */
              body {
                font-family: 'Segoe UI', sans-serif;
                background-color: #f9f9f9;
                padding: 20px;
              }
              
              h2 {
                font-size: 24px;
                margin-bottom: 20px;
              }
              
              .form-container {
                background-color: #fff;
                border: 1px solid #ddd;
                padding: 20px;
              }
              
              .form-container select,
              .form-container input {
                width: 100%;
                padding: 10px;
                margin-bottom: 10px;
              }
              
              .form-container button {
                margin-right: 10px;
              }
            `}
          </style>
        </head>
        <body>
          <div class="form-container">
            <h2>Create New Sale</h2>
            <div>
              <label>Customer:</label>
              <select id="customerName">
                <option value="">Select Customer</option>
                ${this.props.sale.customers.map(
            (customer) =>
                `<option value="${customer.name}">${customer.name}</option>`
        )}
              </select>
            </div>
            <div>
              <label>Product:</label>
              <select id="productName">
                <option value="">Select Product</option>
                ${this.props.sale.products.map(
            (product) =>
                `<option value="${product.name}">${product.name}</option>`
        )}
              </select>
            </div>
            <div>
              <label>Store:</label>
              <select id="storeName">
                <option value="">Select Store</option>
                ${this.props.sale.stores.map(
            (store) =>
                `<option value="${store.name}">${store.name}</option>`
        )}
              </select>
            </div>
            <div>
              <label>Date Sold:</label>
              <input type="text" id="dateSold" placeholder="YYYY-MM-DD" />
            </div>
            <button id="createButton">Create</button>
            <button onclick="window.close()">Cancel</button>
            <script>
              // Function to handle creating a new sale in the main window and close the create popup window
              function handleCreateSale2() {
                const customerName = document.getElementById('customerName').value;
                const productName = document.getElementById('productName').value;
                const storeName = document.getElementById('storeName').value;
                const dateSold = document.getElementById('dateSold').value;

                window.opener.postMessage(
                  {
                    type: 'createSale',
                    customerName,
                    productName,
                    storeName,
                    dateSold,
                  },
                  window.origin
                );
                window.close();
              }

              const createButton = document.getElementById('createButton');
              createButton.addEventListener('click', handleCreateSale2);

              // Remove the event listener when the pop-up window is closed
              window.addEventListener('beforeunload', () => {
                createButton.removeEventListener('click', handleCreateSale2);
              });
            </script>
          </div>
        </body>
      </html>
    `);
    };



    render() {
        return (
            <button className="ui button" onClick={this.openCreatePopup}>Create New Sale</button>
        );
    }
}

export default CreateSale;