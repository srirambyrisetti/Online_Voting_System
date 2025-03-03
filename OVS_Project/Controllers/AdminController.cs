using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OVS_Project.DTOs;
using OVS_Project.Models;
using OVS_Project.Service;

namespace OVS_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TokenService _tokenService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(AppDbContext context, TokenService tokenService, ILogger<AdminController> logger)
        {
            _context = context;
            _tokenService = tokenService;
            _logger = logger;
        }

        // Register a new admin
        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            try
            {
                if (user.Role != "Admin")
                {
                    _logger.LogWarning("Invalid role for admin registration: {Role}", user.Role);
                    return BadRequest(new { message = "Invalid role for admin registration" });
                }

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Admin registered successfully: {Username}", user.Username);
                return Ok(new { message = "Admin registered successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while registering admin: {Username}", user.Username);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while registering admin" });
            }
        }

        // Admin login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var admin = _context.Users.SingleOrDefault(u => u.Email == loginDto.Email && u.Password == loginDto.Password && u.Role == "Admin");

                if (admin == null)
                {
                    _logger.LogWarning("Unauthorized login attempt for email: {Email}", loginDto.Email);
                    return Unauthorized();
                }

                var token = _tokenService.GenerateToken(admin.Username, admin.Role);
                _logger.LogInformation("Admin logged in successfully: {Username}", admin.Username);
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while logging in admin: {Email}", loginDto.Email);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while logging in admin" });
            }
        }
    }
}
