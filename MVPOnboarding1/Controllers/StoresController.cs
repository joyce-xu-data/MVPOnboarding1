
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MVPOnboarding1.Models;
using MVPOnboarding1.Code;
using MVPOnboarding1.Dto;

namespace MVPOnboarding1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoresController : ControllerBase
    {
        private readonly Mvponboarding1Context _context;

        public StoresController(Mvponboarding1Context context)
        {
            _context = context;
        }

        // GET: api/Stores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoreDto>>> GetStores()
        {
            if (_context.Stores == null)
            {
                return NotFound();
            }
            var stores = await _context.Stores.Select(s => Mapper.MapStoreDto(s)).ToListAsync();
            return new JsonResult(stores);
        }

        // GET: api/Stores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StoreDto>> GetStore(int id)
        {
            if (_context.Stores == null)
            {
                return NotFound();
            }
            var store = await _context.Stores.Select(s => Mapper.MapStoreDto(s)).ToListAsync();

            if (store == null)
            {
                return NotFound();
            }

            return new JsonResult(store);
        }

        // PUT: api/Stores/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(int id, StoreDto store)
        {
            if (id != store.Id)
            {
                return BadRequest();
            }

            var existingStore = await _context.Stores.FindAsync(id);
            if (existingStore == null)
            {
                return NotFound();
            }

            existingStore.Name = store.Name;
            existingStore.Address = store.Address;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StoreExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(store);
        }

        // POST: api/Stores
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<StoreDto>> PostStore(StoreDto store)
        {
            if (_context.Stores == null)
            {
                return Problem("Entity set 'Mvponboarding1Context.Stores'  is null.");
            }

            var entity = Mapper.MapStore(store);

            if (store.Id == 0)
            {
                _context.Stores.Add(entity);
            }

            else
            {
                _context.Stores.Update(entity).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();

            return new JsonResult(Mapper.MapStoreDto(entity));
        }

        // DELETE: api/Stores/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStore(int id)
        {
            if (_context.Stores == null)
            {
                return NotFound();
            }
            var store = await _context.Stores.FindAsync(id);
            if (store == null)
            {
                return NotFound();
            }

            _context.Stores.Remove(store);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StoreExists(int id)
        {
            return (_context.Stores?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}