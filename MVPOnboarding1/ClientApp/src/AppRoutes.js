import React from 'react';
import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import { CustomerList } from "./components/Customer/CustomerList";
import { ProductList } from "./components/Product/ProductList";
import { StoreList } from "./components/Store/StoreList";
import { SaleList } from "./components/Sale/SaleList";


const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/counter',
        element: <Counter />
    },
    {
        path: '/fetch-data',
        element: <FetchData />
    },
    {   
        path: '/customer/customerlist',
        element: <CustomerList />
    },
    {
        path: '/product/productlist',
        element: <ProductList />
    },
    {
        path: '/Store/storelist',
        element: <StoreList />
    },
    {
        path: '/Customer/customerlist',
        element: <CustomerList />
    },
    {
        path: '/Sale/salelist',
        element: <SaleList />
    },
];

export default AppRoutes;

