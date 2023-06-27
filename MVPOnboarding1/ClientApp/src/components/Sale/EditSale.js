import React, { useEffect, useState } from 'react';

const EditSale = (props) => {
    const { saleId, customerName, productName, storeName, dateSold, onSave } = props;
    const [editedCustomerName, setEditedCustomerName] = useState(customerName);
    const [editedProductName, setEditedProductName] = useState(productName);
    const [editedStoreName, setEditedStoreName] = useState(storeName);
    const [editedDateSold, setEditedDateSold] = useState(dateSold);

    const handleSave = () => {
        onSave(saleId, editedCustomerName, editedProductName, editedStoreName, editedDateSold);
        window.close();
    };

    useEffect(() => {
        const editWindow = window.open('', '_blank', 'width=400,height=500');

        const handlePopupMessage = (event) => {
            const { type, customerName, productName, storeName, dateSold } = event.data;
            if (type === 'updateSale') {
                setEditedCustomerName(customerName);
                setEditedProductName(productName);
                setEditedStoreName(storeName);
                setEditedDateSold(dateSold);
            }
        };

        editWindow.addEventListener('message', handlePopupMessage);

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
            saveButton.addEventListener('click', () => {
              ${handleSave.toString()}();
            });

            // Remove the event listener when the pop-up window is closed
            window.addEventListener('beforeunload', () => {
              saveButton.removeEventListener('click', () => {
                ${handleSave.toString()}();
              });
            });
          </script>
        </body>
      </html>
    `);
        editWindow.document.close();

        return () => {
            editWindow.removeEventListener('message', handlePopupMessage);
            editWindow.close();
        };
    }, [customerName, productName, storeName, dateSold, saleId, onSave, props.sale.customers, props.sale.products, props.sale.stores]);

    return null; // Since this is a popup window, return null as we don't need to render anything
};

export default EditSale;
