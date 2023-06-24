// deleteWindowContent.js

import React, { Component } from 'react';

export function generateDeleteWindowContent(productId) {
    return `
    <html>
      <head>
        <style>
          /* Styles for the delete window */
        </style>
      </head>
      <body>
        <h2>Delete Product</h2>
        <p>Are you sure you want to delete this product?</p>
        <button id="confirmDeleteButton">Yes</button>
        <button id="cancelDeleteButton">No</button>
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
      </body>
    </html>
  `;
}
