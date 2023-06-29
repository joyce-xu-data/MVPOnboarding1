using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MVPOnboarding1.Models;
using MVPOnboarding1.Code;
using MVPOnboarding1.Dto;

namespace MVPOnboarding1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly Mvponboarding1Context _context;

        public SalesController(Mvponboarding1Context context)
        {
            _context = context;
        }

        // GET: api/Sales
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SaleDto>>> GetSales()
        {
            if (_context.Sales == null)
            {
                return NotFound();
            }

            var sales = await _context.Sales
                  .Include(p => p.Product)
                  .Include(s => s.Store)
                  .Include(c => c.Customer)
                  .Select(sa => Mapper.MapSaleDto(sa))
                  .ToListAsync();

            return new JsonResult(sales);
        }

        // GET: api/Sales/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SaleDto>> GetSale(int id)
        {
            var sale = await _context.Sales
                .Include(p => p.Product)
                .Include(s => s.Store)
                .Include(c => c.Customer)
                .Where(s => s.Id == id) // Filter by sale ID
                .Select(sa => Mapper.MapSaleDto(sa))
                .FirstOrDefaultAsync();

            if (sale == null)
            {
                return NotFound();
            }

            return sale;
        }

        // PUT: api/Sales/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(int id, SaleDto sale)
        {
            if (id != sale.Id)
            {
                return BadRequest();
            }

            var existingSale = await _context.Sales
                .Include(s => s.Customer)
                .Include(s => s.Product)
                .Include(s => s.Store)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (existingSale == null)
            {
                return NotFound();
            }

            existingSale.Customer.Name = sale.CustomerName;
            existingSale.Product.Name = sale.ProductName;
            existingSale.Store.Name = sale.StoreName;

            //// Update the customer, product, and store names with new instances
            //existingSale.Customer = new Customer { Name = sale.CustomerName };
            //existingSale.Product = new Product { Name = sale.ProductName };
            //existingSale.Store = new Store { Name = sale.StoreName };
            //existingSale.DateSold = sale.DateSold;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SaleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(sale);
        }


        // POST: api/Sales
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [HttpPost]
        public async Task<ActionResult<SaleDto>> PostSale([FromBody] SaleInputDto saleInputDto)
        {
            if (_context.Sales == null)
            {
                return Problem("Entity set 'Mvponboarding1Context.Sales' is null.");
            }

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Name == saleInputDto.CustomerName);
            if (customer == null)
            {
                return NotFound($"Customer with name '{saleInputDto.CustomerName}' not found.");
            }

            var product = await _context.Products.FirstOrDefaultAsync(p => p.Name == saleInputDto.ProductName);
            if (product == null)
            {
                return NotFound($"Product with name '{saleInputDto.ProductName}' not found.");
            }

            var store = await _context.Stores.FirstOrDefaultAsync(s => s.Name == saleInputDto.StoreName);
            if (store == null)
            {
                return NotFound($"Store with name '{saleInputDto.StoreName}' not found.");
            }

            var sale = new Sale
            {
                CustomerId = customer.Id,
                ProductId = product.Id,
                StoreId = store.Id,
                DateSold = saleInputDto.DateSold
            };

            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();

            return new JsonResult(Mapper.MapSaleDto(sale));
        }

        // DELETE: api/Sales/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSale(int id)
        {
            if (_context.Sales == null)
            {
                return NotFound();
            }
            var sale = await _context.Sales.FindAsync(id);
            if (sale == null)
            {
                return NotFound();
            }

            _context.Sales.Remove(sale);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SaleExists(int id)
        {
            return (_context.Sales?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}