using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseManagement.Models;
using CourseManagement.Services;
using CourseManagement.Business;
using System.Security.Claims;
using CourseManagement.Dtos;

namespace CourseManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IJwtService _jwtService;
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;

        public AccountController(AppDbContext context, IJwtService jwtService, IUserService userService, IConfiguration configuration)
        {
            _context = context;
            _jwtService = jwtService;
            _userService = userService;
            _configuration = configuration;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find user by email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email && u.IsActive);

            if (user == null || user.Password != loginDto.Password)
            {
                return BadRequest(new { message = "Invalid email or password" });
            }

            int age = 0;

            if (user.DateOfBirth.HasValue)
            {
                var today = DateOnly.FromDateTime(DateTime.Today);
                age = today.Year - user.DateOfBirth.Value.Year;

                if (user.DateOfBirth.Value > today.AddYears(-age))
                    age--;
            }

            var accessToken = _jwtService.GenerateAccessToken(user.Id, user.Name, user.Email, user.IsAdmin, age.ToString());
            var refreshToken = _jwtService.GenerateRefreshToken(user.Id, user.Name, user.Email, user.IsAdmin, age.ToString());

            var jwtSettings = _configuration.GetSection("JwtSettings");
            var expirationMinutes = int.Parse(jwtSettings["AccessTokenExpirationMinutes"]!);

            var response = new TokenResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes)
            };

            return Ok(response);
        }

        [HttpPost("Refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            if (string.IsNullOrEmpty(request.RefreshToken))
            {
                return BadRequest(new { message = "Refresh token is required" });
            }

            // Validate the refresh token
            var principal = _jwtService.ValidateToken(request.RefreshToken);
            
            if (principal == null)
            {
                return Unauthorized(new { message = "Invalid refresh token" });
            }

            // Check if this is actually a refresh token
            var tokenType = principal.FindFirst("tokenType")?.Value;
            if (tokenType != "refresh")
            {
                return Unauthorized(new { message = "Invalid token type" });
            }

            // Extract user information from the refresh token
            var userIdClaim = principal.FindFirst("userId")?.Value;
            var name = principal.FindFirst(ClaimTypes.Name)?.Value;
            var email = principal.FindFirst(ClaimTypes.Email)?.Value;
            var age = principal.FindFirst("age")?.Value;
            var isAdminClaim = principal.FindFirst("isAdmin")?.Value;
            bool isAdmin = bool.TryParse(isAdminClaim, out var adminValue) && adminValue;

            if (string.IsNullOrEmpty(userIdClaim) || string.IsNullOrEmpty(name) || string.IsNullOrEmpty(email))
            {
                return Unauthorized(new { message = "Invalid token claims" });
            }

            // Parse userId
            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { message = "Invalid user ID in token" });
            }

            // Verify user still exists and is active
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email && u.IsActive);

            if (user == null)
            {
                return Unauthorized(new { message = "User no longer exists or is inactive" });
            }

            // Generate new tokens
            var newAccessToken = _jwtService.GenerateAccessToken(user.Id, user.Name, user.Email, user.IsAdmin, age);
            var newRefreshToken = _jwtService.GenerateRefreshToken(user.Id, user.Name, user.Email, user.IsAdmin, age);

            var jwtSettings = _configuration.GetSection("JwtSettings");
            var expirationMinutes = int.Parse(jwtSettings["AccessTokenExpirationMinutes"]!);

            var response = new TokenResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes)
            };

            return Ok(response);
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if user already exists
            if (await _userService.UserExistsAsync(registerDto.Email))
            {
                return BadRequest(new { message = "User with this email already exists" });
            }

            try
            {
                // Create new user with IsAdmin = true as requested
                var userDto = new UserDto
                {
                    Name = registerDto.Name,
                    Email = registerDto.Email,
                    Password = registerDto.Password,
                    IsAdmin = true
                };

                var user = await _userService.CreateUserAsync(userDto);

                return Ok(new { 
                    message = "User registered successfully", 
                    user = new { 
                        id = user.Id, 
                        name = user.Name, 
                        email = user.Email, 
                        isAdmin = user.IsAdmin 
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while registering the user", error = ex.Message });
            }
        }

        [HttpPost("Logout")]
        public IActionResult Logout()
        {
            // Since JWT tokens are stateless, logout is primarily handled on the client side
            // by removing the token from storage. This endpoint provides confirmation.
            return Ok(new { message = "Successfully logged out" });
        }
    }
}
