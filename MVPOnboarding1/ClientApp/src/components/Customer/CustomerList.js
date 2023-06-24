import React, { Component } from 'react';

export class CustomerList extends Component {

    constructor(props) {
        super(props);
        this.state = { customers: [], loading: true };
    }

    componentDidMount() {
        this.populateCustomerData();
    }

    static renderCustomerTable(customers) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(customer =>
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.name}</td>
                            <td>{customer.address}</td>
                            <td><a class="btn" href="#"><i class="icon-edit"></i>Edit</a></td>
                            <td><a class="btn" href="#"><i class="icon-delete"></i>Delete</a></td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : CustomerList.renderCustomerTable(this.state.customers);

        return (
            <div>
                <h1 id="tabelLabel" >Customer Details</h1>
                {contents}
            </div>
        );
    }

    async populateCustomerData() {
        console.log('Called api method');
        const response = await fetch('api/customers');
        console.log(response);
        const data = await response.json();
        console.log(data);
        this.setState({ customers: data, loading: false });
    }
}

