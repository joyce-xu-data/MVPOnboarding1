import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',textAlign: 'center', height: '80vh' }}>
                <div>
                    <h1> Welcome to the Italian Alimentari </h1>
                    <h3 style={{ marginTop: '20px' }}>Track your Customer, Product, Store, and Sale Data at your fingertips! </h3>
                </div>
            </div>
        );
    }
}
