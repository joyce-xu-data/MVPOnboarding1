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
          /* Styles for the create popup window */
        </style>
      </head>
      <body>
        <h2>Create New Product</h2>
        <input type="text" id="productName" placeholder="Product Name" />
        <input type="text" id="productPrice" placeholder="Product Price" />
        <button id="createButton">Create</button>
        <button onclick="window.close()">Cancel</button>
        <script>
          // Function to handle creating a new product in the main window
          function handleCreateProduct() {
              const productName = document.getElementById('productName').value;
            const productPrice = document.getElementById('productPrice').value;
            window.opener.postMessage(
              { type: 'createProduct', name: productName, price: productPrice },
              window.origin
            );
          }

            document.getElementById('createButton').addEventListener('click', handleCreateProduct);

        </script>
      </body>
    </html>
  `);
    };


    render() {
        return null; // Since this is a popup window, return null as we don't need to render anything
    }

}

export default CreateProduct;