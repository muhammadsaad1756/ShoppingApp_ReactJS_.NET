using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoppingApp.API.Data;
using ShoppingApp.API.Models;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace ShoppingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BuyerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BuyerController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "buyer")]
        [HttpGet("all-items-report")]
        public async Task<IActionResult> AllItemsReport([FromQuery] string searchTerm = null)
        {
            // Start with all items
            var items = _context.Items.AsQueryable();

            // Filter by search term if provided
            if (!string.IsNullOrEmpty(searchTerm))
            {
                items = items.Where(i => i.Name.Contains(searchTerm));
            }

            // Return the list of items as a response
            var itemsList = await items.ToListAsync();
            return Ok(itemsList);
        }



       

        [Authorize(Roles = "buyer")]
        [HttpGet("view-item/{id}")]
        public IActionResult ViewItem(int id)
        {
            var item = _context.Items.FirstOrDefault(i => i.Id == id);
            if (item == null)
            {
                return NotFound("Item not found.");
            }

            return Ok(item);
        }

        [HttpPost("add-to-cart")]
        public IActionResult AddToCart([FromBody] CartRequest request)
        {
            var buyerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var shoppingCart = _context.ShoppingCarts.FirstOrDefault(sc => sc.UserId == buyerId);

            if (shoppingCart == null)
            {
                shoppingCart = new ShoppingCart { UserId = buyerId };
                _context.ShoppingCarts.Add(shoppingCart);
                _context.SaveChanges();
            }

            var cartItem = _context.CartItems.FirstOrDefault(ci => ci.BuyerId == buyerId && ci.ItemId == request.ItemId);
            if (cartItem == null)
            {
                cartItem = new CartItem
                {
                    ItemId = request.ItemId,
                    BuyerId = buyerId,
                    ShoppingCartId = shoppingCart.Id,
                    Quantity = request.Quantity,
                    TotalPrice = _context.Items.Find(request.ItemId).Price * request.Quantity
                };
                _context.CartItems.Add(cartItem);
            }
            else
            {
                cartItem.Quantity += request.Quantity;
                cartItem.TotalPrice = _context.Items.Find(request.ItemId).Price * cartItem.Quantity;
                _context.CartItems.Update(cartItem);
            }

            _context.SaveChanges();
            return Ok("Item added to cart.");
        }

        // Request model for adding to cart
        public class CartRequest
        {
            public int ItemId { get; set; }
            public int Quantity { get; set; }
        }


        [HttpGet("shopping-cart")]
        public async Task<IActionResult> ShoppingCart()
        {
            var buyerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var cartItems = await _context.CartItems
                .Include(c => c.Item)
                .Where(c => c.BuyerId == buyerId)
                .ToListAsync();

            return Ok(cartItems);
        }

        [HttpPost("remove-from-cart/{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem != null)
            {
                _context.CartItems.Remove(cartItem);
                await _context.SaveChangesAsync();
                return Ok("Item removed from cart.");
            }

            return NotFound("Cart item not found.");
        }
    }
}
