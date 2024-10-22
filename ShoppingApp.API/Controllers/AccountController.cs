using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Linq;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.Extensions.Configuration;
using ShoppingApp.API.Data;
using ShoppingApp.API.Models;
using System;
using Microsoft.AspNetCore.Authorization;
using System.IO;

namespace ShoppingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AccountController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Create a LoginRequest model to receive login details
        public class LoginRequest
        {
            public string UserName { get; set; }
            public string Password { get; set; }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            if (string.IsNullOrEmpty(loginRequest.UserName) || string.IsNullOrEmpty(loginRequest.Password))
            {
                return BadRequest("Username and Password are required.");
            }

            var user = _context.Users.FirstOrDefault(u => u.UserName == loginRequest.UserName && u.PasswordHash == loginRequest.Password);

            if (user != null)
            {
                var token = GenerateJwtToken(user);
                return Ok(new { token });
            }

            return Unauthorized("Invalid login attempt.");
        }

        private string GenerateJwtToken(Users user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [AllowAnonymous]
        [HttpPost("UserDetails")]
        public IActionResult UserDetails([FromBody] Users model)
        {
            if (!ModelState.IsValid)
            {
                // Log the validation errors to understand the bad request issue
                return BadRequest(ModelState);
            }

            // Check if the user already exists by username
            var user = _context.Users.FirstOrDefault(u => u.UserName == model.UserName);

            if (user == null)
            {
                // Register a new user if they don't exist
                var newUser = new Users
                {
                    UserName = model.UserName,
                    Name = model.Name,
                    Age = model.Age,
                    ProfilePictureUrl = model.ProfilePictureUrl,
                    Role = model.Role ?? "Buyer", // Default role to Buyer if not provided
                    PasswordHash = model.PasswordHash,
                    IsAdmin = model.IsAdmin
                };

                _context.Users.Add(newUser);
                _context.SaveChanges();

                return Ok(new { message = "New user registered successfully." });
            }
            else
            {
                // Update the existing user's details
                user.Name = model.Name;
                user.Age = model.Age;
                user.ProfilePictureUrl = model.ProfilePictureUrl;
                user.Role = model.Role; // Ensure role is updated correctly
                user.PasswordHash = string.IsNullOrEmpty(model.PasswordHash) ? user.PasswordHash : model.PasswordHash;

                _context.SaveChanges();

                return Ok(new { message = "User details updated successfully." });
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok("Logged out successfully.");
        }

        // New endpoint to serve manifest.json
        //[AllowAnonymous]
        //[HttpGet("manifest.json")]
        //public IActionResult GetManifest()
        //{
        //    var manifestPath = Path.Combine(Directory.GetCurrentDirectory(), "/public/manifest.json");

        //    if (!System.IO.File.Exists(manifestPath))
        //    {
        //        return NotFound();
        //    }

        //    var json = System.IO.File.ReadAllText(manifestPath);
        //    return Content(json, "application/json");
        //}
    }
}
