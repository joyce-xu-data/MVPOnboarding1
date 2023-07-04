import React, { Component } from 'react';

export class EditProduct extends Component {
    componentDidMount() {
        window.addEventListener('message', this.handlePopupMessage);
        this.openEditWindow();
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handlePopupMessage);
    }

    openEditWindow2 = (productId, productName, productPrice) => {
     

        // Open a new window
        const editWindow = window.open('', '_blank', 'width=400,height=300');

        // Write the content of the new window
        editWindow.document.write(`
      <html>
        <head>
          <title>Edit Product</title>
         
          <style>
            /* Styles for the edit window */
            body {
              font-family: 'Segoe UI', sans-serif;
              background-color: #f9f9f9;
              padding: 20px;
            }
            
            h2 {
              font-size: 24px;
              margin-bottom: 20px;
            }
            
            input {
              width: 100%;
              padding: 10px;
              margin-bottom: 10px;
            }
            
            button {
              margin-right: 10px;
            }
          </style>
        </head>
        <body>
          <h2>Edit Product</h2>
          <input
            type="text"
            id = "nameInput"
            value="${productName}"
           
          />
          <input
            type="text"
            id ="priceInput"
            value="${productPrice}"
            
          />
          <button id="saveButton">Save</button>
          <button onclick="window.close()">Cancel</button>
          <script>
            // Function to update the edited name in the main window
             function handleEdit() {
            // Get the edited values from the inputs and call the appropriate functions in the main window
            const nameInput = document.getElementById('nameInput').value;
            const priceInput = document.getElementById('priceInput').value;

            window.opener.postMessage(
              { type: 'updateProduct',
                productId:${productId},
                name: nameInput,
                price: priceInput },
              window.origin
            );
            window.close();
          }
          document.getElementById('saveButton').addEventListener('click', handleEdit);
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