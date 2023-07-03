﻿import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';

export class CreateCustomer extends Component {
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
          <title>Create New Customer</title>
          
        </head>
        <body>
          <div class="form-container">
            <h2>Create New Customer</h2>
            <input type="text" id="customerName" placeholder="Customer Name" />
            <input type="text" id="customerAddress" placeholder="Customer Address" />
            <button id="createButton">Create</button>
            <button onclick="window.close()">Cancel</button>
            <script>
              // Function to handle creating a new customer in the main window and close the create popup window
              function handleCreateCustomer() {
                const customerName = document.getElementById('customerName').value;
                const customerAddress = document.getElementById('customerAddress').value;
                window.opener.postMessage(
                  { type: 'createCustomer', name: customerName, address: customerAddress },
                  window.origin
                );
                window.close();
              }

              document.getElementById('createButton').addEventListener('click', handleCreateCustomer);
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
export default CreateCustomer;