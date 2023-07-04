import React, { Component } from 'react';


export class EditSale extends Component {
    componentDidMount() {
        window.addEventListener('message', this.handlePopupMessage);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handlePopupMessage);
    }


    openEditWindow2 = (saleId, customerName, productName, storeName, dateSold) => {
        console.log("openeditwindow-child", saleId, customerName, productName, storeName, dateSold)
        //console.log("openeditwindow-child2", saleId, customers, products, stores, dateSold)
        console.log("props-cust", this.props.customers)
        console.log("props-products", this.props.products)

        const custId = this.props.customers.map((customer) => customer.id)
        const custName = this.props.customers.map((customer) => customer.name)
        console.log(custId)
        console.log(custName)

        const windowWidth = 400;
        const windowHeight = 300;
        const left = (window.screen.width - windowWidth) / 2;
        const top = (window.screen.height - windowHeight) / 2;

        const editWindow = window.open('', '_blank', `width=${windowWidth}, height=${windowHeight}, left=${left}, top=${top}`);

       

        const customerOptions = this.props.customers.map((customer) => (
            `<option key="${customer.id}" value="${customer.name}">
    ${customer.name}
  </option>`
        ));

        const productOptions = this.props.products.map((product) => (
            `<option key="${product.id}" value="${product.name}">
    ${product.name}
  </option>`
        ));

        const storeOptions = this.props.stores.map((store) => (
            `<option key="${store.id}" value="${store.name}">
    ${store.name}
  </option>`
        ));
       

        // Write the content of the new window
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
        ${customerOptions}
      </select>


              </select>
            </div>
            <div>
              <label>Product:</label>
              <select id="productName">
                <option value="">Select Product</option>
              ${productOptions}</option>
)}

              </select>
            </div>
            <div>
              <label>Store:</label>
              <select id="storeName">
                <option value="">Select Store</option>
               ${storeOptions}</option>
)}

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

          function handleSave() {
              const customerName = document.getElementById('customerName').value;
              const productName = document.getElementById('productName').value;
              const storeName = document.getElementById('storeName').value;
              const dateSold = document.getElementById('dateSold').value;

              window.opener.postMessage(
                {
                  type: 'updateSale',
                  saleId: ${(saleId)},
                  customerName: customerName,
                  productName: productName,
                  storeName: storeName,
                  dateSold: dateSold,
                },
                window.origin
              );
              window.close();
            };

            document.getElementById('saveButton').addEventListener('click', handleSave);

            const customerNameSelect = document.getElementById('customerName');
            customerNameSelect.value = "${customerName}";


            const productNameSelect = document.getElementById('productName');
            productNameSelect.value = "${productName}";


            const storeNameSelect = document.getElementById('storeName');
            storeNameSelect.value = "${storeName}";


            const dateSoldInput = document.getElementById('dateSold');
            dateSoldInput.value = "${dateSold}";


          </script>
        </body>
              </html>
    `);
    };

    render() {
        return null;
    }
}
export default EditSale;