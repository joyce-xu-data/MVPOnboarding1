import React, { Component } from 'react';

export class EditStore extends Component {
    componentDidMount() {
        window.addEventListener('message', this.handlePopupMessage);
        this.openEditWindow();
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handlePopupMessage);
    }

    openEditWindow2 = (storeId,storeName,storeAddress) => {
        const windowWidth = 400;
        const windowHeight = 300;
        const left = (window.screen.width - windowWidth) / 2;
        const top = (window.screen.height - windowHeight) / 2;

        const editWindow = window.open('', '_blank', `width=${windowWidth}, height=${windowHeight}, left=${left}, top=${top}`);


        // Write the content of the new window
        editWindow.document.write(`
      <html>
        <head>
          <title>Edit Store</title>
        
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
          <h2>Edit Store</h2>
          <input
            type="text"
            id = "nameInput"
            value="${storeName}"
          
          />
          <input
            type="text"
            id = "addressInput"
            value="${storeAddress}"
            
          />
          <button id="saveButton">Save</button>
          <button onclick="window.close()">Cancel</button>
           <script>
          // Function to update the edited name in the main window
            function handleEdit() {
            // Get the edited values from the inputs and call the appropriate functions in the main window
            const nameInput = document.getElementById('nameInput').value;
            const addressInput = document.getElementById('addressInput').value;

            window.opener.postMessage(
              { type: 'updateStore',
                storeId:${storeId},
                name: nameInput,
                address: addressInput },
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
export default EditStore;
