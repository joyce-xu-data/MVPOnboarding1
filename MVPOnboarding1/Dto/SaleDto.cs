using System;
namespace MVPOnboarding1.Dto
{
    public class SaleDto
    {

        public int Id { get; set; }

        public int CustomerId { get; set; }

        public int ProductId { get; set; }

        public int StoreId { get; set; }

        public string ProductName { get; set; } = String.Empty;

        public string CustomerName { get; set; } = String.Empty;

        public string StoreName { get; set; } = String.Empty;

        public DateTime? DateSold
        {
            get; set;
        }
    }
}

