import React, { Component } from 'react';


export function generateDeleteWindowContent(customerId) {
    return `
    <html>
   <head>
    
     <link rel="stylesheet" href="Popup.css">
</head>

      <body>
        <div class="ui segment">
          <h2 class="ui header">Delete Customer</h2>
          <p>Are you sure you want to delete this customer?</p>
          <button class="ui primary button" id="confirmDeleteButton">Yes</button>
          <button class="ui button" id="cancelDeleteButton">No</button>
          <script>
            const confirmDeleteButton = document.getElementById('confirmDeleteButton');
            const cancelDeleteButton = document.getElementById('cancelDeleteButton');

            confirmDeleteButton.addEventListener('click', () => {
              window.opener.confirmDeleteCustomer(${customerId});
              window.close();
            });

            cancelDeleteButton.addEventListener('click', () => {
              window.close();
            });

          </script>
        </div>
      </body>
    </html>
  `;
}