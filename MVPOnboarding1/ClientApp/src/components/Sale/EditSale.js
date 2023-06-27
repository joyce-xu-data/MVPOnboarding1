import React, { useEffect, useState } from 'react';

const EditSale = (props) => {
    const { saleId, customerName, productName, storeName, dateSold, onSave } = props;
    const [editedCustomerName, setEditedCustomerName] = useState(customerName);
    const [editedProductName, setEditedProductName] = useState(productName);
    const [editedStoreName, setEditedStoreName] = useState(storeName);
    const [editedDateSold, setEditedDateSold] = useState(dateSold);
    const [isSaleCreatedOrDeleted, setIsSaleCreatedOrDeleted] = useState(false); // Flag to track sale creation or deletion

    useEffect(() => {
        if (isSaleCreatedOrDeleted) {
            return; // Skip opening the edit window if sale was created or deleted
        }

        const editWindow = window.open('', '_blank', 'width=400,height=500');

        const handlePopupMessage = (event) => {
            const { type, saleId: eventId, customerName, productName, storeName, dateSold } = event.data;
            if (type === 'updateSale' && eventId === saleId) {
                setEditedCustomerName(customerName);
                setEditedProductName(productName);
                setEditedStoreName(storeName);
                setEditedDateSold(dateSold);
            }
        };

        const handleSave = () => {
            onSave(saleId, editedCustomerName, editedProductName, editedStoreName, editedDateSold);
            setIsSaleCreatedOrDeleted(true); // Set flag to true after saving the sale
            window.close();
        };

        const handleCloseWindow = () => {
            window.removeEventListener('message', handlePopupMessage);
            window.removeEventListener('beforeunload', handleCloseWindow);
            editWindow.close();
        };

        editWindow.document.open();
        editWindow.document.write(`
      <html>
        <head>
          <title>Edit Sale</title>
          <style>
            /* Additional custom styles for the edit popup window */
            body {
              font-family: 'Segoe UI', sans-serif;
              background-color: #f9f9f9;
              padding: 20px;
            }

            h2 {
              font-size: 24px;
              margin-bottom: 20px;
            }

            .form-container {
              background-color: #fff;
              border: 1px solid #ddd;
              padding: 20px;
            }

            .form-container select,
            .form-container input {
              width: 100%;
              padding: 10px;
              margin-bottom: 10px;
            }

            .form-container button {
              margin-right: 10px;
            }
          </style>
        </head>
        <body>
          <div class="form-container">
            <h2>Edit Sale</h2>
            <div>
              <label>Customer:</label>
              <select id="customerName">
                <option value="">Select Customer</option>
                ${props.sale.customers
                .map(
                    (customer) =>
                        `<option value="${customer.name}">${customer.name}</option>`
                )
                .join('')}
              </select>
            </div>
            <div>
              <label>Product:</label>
              <select id="productName">
                <option value="">Select Product</option>
                ${props.sale.products
                .map(
                    (product) =>
                        `<option value="${product.name}">${product.name}</option>`
                )
                .join('')}
              </select>
            </div>
            <div>
              <label>Store:</label>
              <select id="storeName">
                <option value="">Select Store</option>
                ${props.sale.stores
                .map(
                    (store) =>
                        `<option value="${store.name}">${store.name}</option>`
                )
                .join('')}
              </select>
            </div>
            <div>
              <label>Date Sold:</label>
              <input type="text" id="dateSold" placeholder="YYYY-MM-DD" />
            </div>
            <button id="saveButton">Save</button>
            <button onclick="window.close()">Cancel</button>
          </div>
          <script>
            const customerNameSelect = document.getElementById('customerName');
            customerNameSelect.value = "${customerName}";
            customerNameSelect.addEventListener('change', (event) => {
              window.opener.postMessage(
                {
                  type: 'updateSale',
                  saleId: ${saleId},
                  customerName: event.target.value,
                  productName: document.getElementById('productName').value,
                  storeName: document.getElementById('storeName').value,
                  dateSold: document.getElementById('dateSold').value,
                },
                window.origin
              );
            });

            const productNameSelect = document.getElementById('productName');
            productNameSelect.value = "${productName}";
            productNameSelect.addEventListener('change', (event) => {
              window.opener.postMessage(
                {
                  type: 'updateSale',
                  saleId: ${saleId},
                  customerName: document.getElementById('customerName').value,
                  productName: event.target.value,
                  storeName: document.getElementById('storeName').value,
                  dateSold: document.getElementById('dateSold').value,
                },
                window.origin
              );
            });

            const storeNameSelect = document.getElementById('storeName');
            storeNameSelect.value = "${storeName}";
            storeNameSelect.addEventListener('change', (event) => {
              window.opener.postMessage(
                {
                  type: 'updateSale',
                  saleId: ${saleId},
                  customerName: document.getElementById('customerName').value,
                  productName: document.getElementById('productName').value,
                  storeName: event.target.value,
                  dateSold: document.getElementById('dateSold').value,
                },
                window.origin
              );
            });

            const dateSoldInput = document.getElementById('dateSold');
            dateSoldInput.value = "${dateSold}";
            dateSoldInput.addEventListener('change', (event) => {
              window.opener.postMessage(
                {
                  type: 'updateSale',
                  saleId: ${saleId},
                  customerName: document.getElementById('customerName').value,
                  productName: document.getElementById('productName').value,
                  storeName: document.getElementById('storeName').value,
                  dateSold: event.target.value,
                },
                window.origin
              );
            });

            const saveButton = document.getElementById('saveButton');
            saveButton.addEventListener('click', handleSave);

            window.addEventListener('beforeunload', handleCloseWindow);
          </script>
        </body>
      </html>
    `);
        editWindow.document.close();

        window.addEventListener('message', handlePopupMessage);
        window.addEventListener('beforeunload', handleCloseWindow);

        return () => {
            window.removeEventListener('message', handlePopupMessage);
            window.removeEventListener('beforeunload', handleCloseWindow);
            editWindow.close();
        };
    }, [
        saleId,
        customerName,
        productName,
        storeName,
        dateSold,
        onSave,
        props.sale.customers,
        props.sale.products,
        props.sale.stores,
        isSaleCreatedOrDeleted,
    ]);

    return null; // Since this is a popup
};

export default EditSale;
