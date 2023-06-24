﻿import React, { Component } from 'react';

export class EditProduct extends Component {
    componentDidMount() {
        window.addEventListener('message', this.handlePopupMessage);
        this.openEditWindow();
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handlePopupMessage);
    }

    openEditWindow = () => {
        const { productId, productName, productPrice } = this.props;

        // Open a new window
        const editWindow = window.open('', '_blank', 'width=400,height=300');

        // Write the content of the new window
        editWindow.document.write(`
      <html>
        <head>
          <title>Edit Product</title>
          <style>
            /* Styles for the edit window */
          </style>
        </head>
        <body>
          <h2>Edit Product</h2>
          <input
            type="text"
            value="${productName}"
            onchange="window.opener.updateEditedName(this.value)"
          />
          <input
            type="text"
            value="${productPrice}"
            onchange="window.opener.updateEditedPrice(this.value)"
          />
          <button onclick="window.opener.saveEditedProduct(${productId})">Save</button>
          <button onclick="window.close()">Cancel</button>
          <script>
            // Function to update the edited name in the main window
            window.updateEditedName = (value) => {
              window.opener.updateEditedName(value);
            };

            // Function to update the edited price in the main window
            window.updateEditedPrice = (value) => {
              window.opener.updateEditedPrice(value);
            };

            // Function to save the edited product in the main window
            window.saveEditedProduct = (productId) => {
              window.opener.saveEditedProduct(productId);
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    };

    render() {
        return null; // Since this is a popup window, return null as we don't need to render anything
    }
}

export default EditProduct;