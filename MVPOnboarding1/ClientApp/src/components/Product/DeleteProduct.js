import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';

export function generateDeleteWindowContent(productId) {
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
        <link rel="stylesheet" href="/path/to/your/semantic-ui-css/semantic.min.css">
      </head>
      <body>
        <div class="ui segment">
          <h2 class="ui header">Delete Product</h2>
          <p>Are you sure you want to delete this product?</p>
          <button class="ui primary button" id="confirmDeleteButton">Yes</button>
          <button class="ui button" id="cancelDeleteButton">No</button>
          <script>
            const confirmDeleteButton = document.getElementById('confirmDeleteButton');
            const cancelDeleteButton = document.getElementById('cancelDeleteButton');

            confirmDeleteButton.addEventListener('click', () => {
              window.opener.confirmDeleteProduct(${productId});
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
