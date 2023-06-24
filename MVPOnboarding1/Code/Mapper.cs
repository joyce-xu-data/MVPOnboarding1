﻿using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MVPOnboarding1.Dto;

namespace MVPOnboarding1.Code
{
    public static class Mapper
    {
        public static Dto.SaleDto MapSale(Models.Sale Sale)
        {
            var sale = new Dto.SaleDto
            {
                CustomerName = Sale?.Customer?.Name,
                ProductName = Sale?.Product?.Name,
                StoreName = Sale?.Store?.Name,
                DateSold = Sale.DateSold,
                Id = Sale.Id
            };

            return sale;
        }

        public static Dto.ProductDto MapProductDto(Models.Product Product)
        {
            var product = new ProductDto();

            if (Product != null)
            {
                product = new Dto.ProductDto
                {
                    Id = Product.Id,
                    Name = Product.Name,
                    Price = Product.Price
                };
            }

            return product;
        }

        public static Models.Product MapProduct(ProductDto Product)
        {
            var product = new Models.Product();

            if (Product != null)
            {
                product.Id = Product.Id;
                product.Name = Product.Name;
                product.Price = Product.Price;
            }

            return product;
        }

        public static Dto.CustomerDto MapCustomerDto(Models.Customer Customer)
        {
            var customer = new CustomerDto();

            if (Customer != null)
            {
                customer = new Dto.CustomerDto
                {
                    Id = Customer.Id,
                    Address = Customer.Address,
                    Name = Customer.Name
                };
            }

            return customer;
        }

        public static Models.Customer MapCustomer(CustomerDto Customer)
        {
            var customer = new Models.Customer();

            if (Customer != null)
            {
                customer.Id = Customer.Id;
                customer.Address = Customer.Address;
                customer.Name = Customer.Name;
            }

            return customer;
        }

    }
}