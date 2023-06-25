import React, { Component } from 'react';

export class EditCustomer extends Component {
    componentDidMount() {
        window.addEventListener('message', this.handlePopupMessage);
        this.openEditWindow();
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handlePopupMessage);
    }

    openEditWindow = () => {
        const { customerId, customerName, customerAddress } = this.props;

        // Open a new window
        const editWindow = window.open('', '_blank', 'width=400,height=300');

        // Write the content of the new window
        editWindow.document.write(`
      <html>
        <head>
          <title>Edit Customer</title>
        
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
          <h2>Edit Customer</h2>
          <input
            type="text"
            value="${customerName}"
            onchange="window.opener.updateEditedName(this.value)"
          />
          <input
            type="text"
            value="${customerAddress}"
            onchange="window.opener.updateEditedAddress(this.value)"
          />
          <button onclick="saveAndClose(${customerId})">Save</button>
          <button onclick="window.close()">Cancel</button>
          <script>
            // Function to update the edited name in the main window
            window.updateEditedName = (value) => {
              window.opener.updateEditedName(value);
            };

            // Function to update the edited address in the main window
            window.updateEditedAddress = (value) => {
              window.opener.updateEditedAddress(value);
            };

            // Function to save the edited customer in the main window and close the edit window
            function saveAndClose(customerId) {
              window.opener.saveEditedCustomer(customerId);
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    };

    render() {
        return null; // Since this is a popup window, return null as we don't need to render anything
    }
}
export default EditCustomer;
