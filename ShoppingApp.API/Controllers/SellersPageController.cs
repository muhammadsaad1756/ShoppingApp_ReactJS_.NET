using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Linq;
using ShoppingApp.API.Data;
using ShoppingApp.API.Models;

namespace ShoppingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Ensure the entire controller requires authorization
    public class SellersPageController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SellersPageController(AppDbContext context)
        {
            _context = context;
        }

        private int GetLoggedInUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            Console.WriteLine($"Logged in User ID: {userIdClaim}");
            return userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId) ? userId : 0;
        }
        [HttpGet("user-homepage")]
        [Authorize(Roles = "seller")]
        public IActionResult UserHomePage(string searchString = null)
        {
            var userId = GetLoggedInUserId();
            if (userId == 0)
            {
                return Unauthorized("User is not logged in.");
            }

            var itemsForSale = _context.Items.Where(item => item.SellerId == userId);

            if (!string.IsNullOrEmpty(searchString))
            {
                itemsForSale = itemsForSale.Where(i => i.Name.Contains(searchString) || i.Description.Contains(searchString));
            }

            return Ok(itemsForSale.ToList());
        }


        [HttpPost("AddEditItem")]
        [Authorize(Roles = "seller")]
        public IActionResult AddEditItem([FromBody] Items item)
        {
            var userId = GetLoggedInUserId();
            if (userId == 0)
            {
                return Unauthorized("User is not logged in.");
            }

            item.SellerId = userId;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if this is a new item or an edit
            if (item.Id == 0)
            {
                _context.Items.Add(item); // Add new item
            }
            else
            {
                var existingItem = _context.Items.Find(item.Id);
                if (existingItem == null)
                {
                    return NotFound("Item not found.");
                }

                // Check if the current user is authorized to edit the existing item
                if (existingItem.SellerId != userId)
                {
                    return Forbid("User is unauthorized to edit this item.");
                }

                // Update existing item
                existingItem.Name = item.Name;
                existingItem.Description = item.Description;
                existingItem.Price = item.Price;
                existingItem.QuantityAvailable = item.QuantityAvailable;
            }

            // Save changes to the database
            _context.SaveChanges();
            return Ok(item.Id == 0 ? "Item added successfully." : "Item updated successfully.");
        }

        [HttpDelete("delete-item/{id}")]
        [Authorize(Roles = "seller")]
        public IActionResult DeleteItem(int id)
        {
            var userId = GetLoggedInUserId();
            if (userId == 0)
            {
                return Unauthorized("User is not logged in.");
            }

            var item = _context.Items.Find(id);
            if (item != null && item.SellerId == userId)
            {
                _context.Items.Remove(item);
                _context.SaveChanges();
                return Ok("Item deleted successfully.");
            }

            return NotFound("Item not found.");
        }
    }
}
