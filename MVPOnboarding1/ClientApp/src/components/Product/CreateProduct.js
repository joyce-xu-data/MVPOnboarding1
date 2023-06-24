import React, { Component } from 'react';

export class CreateProduct extends Component {
    componentDidMount() {
        window.addEventListener('message', this.handlePopupMessage);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handlePopupMessage);
    }

    openCreatePopup = () => {
        const createPopupWindow = window.open('', '_blank', 'width=400,height=300');

        createPopupWindow.document.write(`
      <html>
        <head>
          <title>Create New Product</title>
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
            <h2>Create New Product</h2>
            <input type="text" id="productName" placeholder="Product Name" />
            <input type="text" id="productPrice" placeholder="Product Price" />
            <button id="createButton">Create</button>
            <button onclick="window.close()">Cancel</button>
            <script>
              // Function to handle creating a new product in the main window and close the create popup window
              function handleCreateProduct() {
                const productName = document.getElementById('productName').value;
                const productPrice = document.getElementById('productPrice').value;
                window.opener.postMessage(
                  { type: 'createProduct', name: productName, price: productPrice },
                  window.origin
                );
                window.close();
              }

              document.getElementById('createButton').addEventListener('click', handleCreateProduct);
            </script>
          </div>
        </body>
      </html>
    `);
    };

    render() {
        return null;
    }
}

export default CreateProduct;
