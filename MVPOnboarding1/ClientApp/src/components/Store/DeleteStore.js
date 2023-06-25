import React, { Component } from 'react';

export function generateDeleteWindowContent(storeId) {
    return `
    <html>
      <head>
        <style>
          /* Styles for the delete window */
          ${`
            body {
              font-family: 'Segoe UI', sans-serif;
              background-color: #f9f9f9;
              padding: 20px;
            }

            h2 {
              font-size: 24px;
              margin-bottom: 20px;
            }

            p {
              margin-bottom: 20px;
            }

            .ui.button {
              margin-right: 10px;
            }
          `}
        </style>
      </head>
      <body>
        <div class="ui segment">
          <h2 class="ui header">Delete Store</h2>
          <p>Are you sure you want to delete this store?</p>
          <button class="ui primary button" id="confirmDeleteButton">Yes</button>
          <button class="ui button" id="cancelDeleteButton">No</button>
          <script>
            const confirmDeleteButton = document.getElementById('confirmDeleteButton');
            const cancelDeleteButton = document.getElementById('cancelDeleteButton');

            confirmDeleteButton.addEventListener('click', () => {
              window.opener.confirmDeleteStore(${storeId});
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
