using System;
namespace MVPOnboarding1.Dto
{
    public class SaleInputDto
    {
        public string CustomerName { get; set; }
        public string ProductName { get; set; }
        public string StoreName { get; set; }
        public DateTime DateSold { get; set; }
    }
}