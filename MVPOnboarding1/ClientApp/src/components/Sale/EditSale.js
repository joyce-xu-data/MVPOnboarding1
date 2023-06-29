import React, { useEffect, useState } from 'react';

const EditSale = (props) => {
    const { saleId, customerName, productName, storeName, dateSold, onSave } = props;
    const [isSaleCreatedOrDeleted, setIsSaleCreatedOrDeleted] = useState(false); // Flag to track sale creation or deletion

    useEffect(() => {
        if (isSaleCreatedOrDeleted) {
            return; // Skip opening the edit window if sale was created or deleted
        }

        const editWindow = window.open('', '_blank', 'width=400,height=500');

        const handlePopupMessage = (event) => {
            console.log('Received message from popup:', event.data);
            const { type, saleId: eventId, customerName: editedCustomerName, productName: editedProductName, storeName: editedStoreName, dateSold: editeDateSold } = event.data;

            console.log('Received values:', {
                type,
                eventId,
                editedCustomerName,
                editedProductName,
                editedStoreName,
               
            });

            if (type === 'updateSale' && eventId === saleId) {
                const updatedSaleData = {
                    saleId: eventId,
                    customerName: editedCustomerName,
                    productName: editedProductName,
                    storeName: editedStoreName,
                    dateSold: editeDateSold
                };
                console.log('Updated sale data:', updatedSaleData);
                onSave(updatedSaleData);
                console.log('onsave being called');
                window.removeEventListener('message', handlePopupMessage);
            }
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
                ${[...new Set(props.sale.customers.map((customer) => customer.name))]
                .map((customerName) => `<option value="${customerName}">${customerName}</option>`)
                .join('')}
              </select>
            </div>
            <div>
              <label>Product:</label>
              <select id="productName">
                <option value="">Select Product</option>
                ${[...new Set(props.sale.products.map((product) => product.name))]
                .map((productName) => `<option value="${productName}">${productName}</option>`)
                .join('')}
              </select>
            </div>
            <div>
              <label>Store:</label>
              <select id="storeName">
                <option value="">Select Store</option>
                ${[...new Set(props.sale.stores.map((store) => store.name))]
                .map((storeName) => `<option value="${storeName}">${storeName}</option>`)
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
            const handleSave = () => {
              const customerName = document.getElementById('customerName').value;
              const productName = document.getElementById('productName').value;
              const storeName = document.getElementById('storeName').value;
              const dateSold = document.getElementById('dateSold').value;

              window.opener.postMessage(
                {
                  type: 'updateSale',
                  saleId: ${saleId},
                  customerName: customerName,
                  productName: productName,
                  storeName: storeName,
                  dateSold: dateSold,
                },
                window.origin
              );
            };

            const customerNameSelect = document.getElementById('customerName');
            customerNameSelect.value = "${customerName}";

            const productNameSelect = document.getElementById('productName');
            productNameSelect.value = "${productName}";

            const storeNameSelect = document.getElementById('storeName');
            storeNameSelect.value = "${storeName}";

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
          </script>
        </body>
      </html>
    `);
        editWindow.document.close();

        window.addEventListener('message', handlePopupMessage);

        return () => {
            window.removeEventListener('message', handlePopupMessage);
            setIsSaleCreatedOrDeleted(true); // Update the flag to indicate sale creation or deletion
            editWindow.close();
        };
    }, [
        saleId,
        customerName,
        productName,
        storeName,
        dateSold,
        props.sale.customers,
        props.sale.products,
        props.sale.stores,
        isSaleCreatedOrDeleted,
        onSave,
    ]);

    return null; // Since this is a popup
};

export default EditSale;
