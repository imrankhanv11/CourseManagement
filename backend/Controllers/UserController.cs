using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CourseManagement.Business;
using CourseManagement.Dtos;
using CourseManagement.Models;
using Microsoft.AspNetCore.Authorization;

namespace CourseManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : BaseController
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateUser([FromBody] UserDto userDto)
        {
            if(!IsAdmin)
            {
                return Unauthorized(new { message = "You are not authorized to access this resource" });
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if user already exists
            if (await _userService.UserExistsAsync(userDto.Email))
            {
                return BadRequest(new { message = "User with this email already exists" });
            }

            try
            {
                var user = await _userService.CreateUserAsync(userDto);

                return Ok(new
                {
                    message = "User created successfully",
                    user = new
                    {
                        id = user.Id,
                        name = user.Name,
                        email = user.Email,
                        dateOfBirth = user.DateOfBirth,
                        phoneNumber = user.PhoneNumber,
                        isActive = user.IsActive,
                        isAdmin = user.IsAdmin,
                        createdOn = user.CreatedOn
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the user", error = ex.Message });
            }
        }

        [HttpPut("Edit")]
        public async Task<IActionResult> EditUser([FromBody] UserDto userDto)
        {
            if(!IsAdmin)
            {
                return Unauthorized(new { message = "You are not authorized to access this resource" });
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await _userService.UpdateUserAsync(userDto);

                return Ok(new
                {
                    message = "User updated successfully",
                    user = new
                    {
                        id = user.Id,
                        name = user.Name,
                        email = user.Email,
                        dateOfBirth = user.DateOfBirth,
                        phoneNumber = user.PhoneNumber,
                        isActive = user.IsActive,
                        isAdmin = user.IsAdmin,
                        createdOn = user.CreatedOn
                    }
                });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the user", error = ex.Message });
            }
        }

        [HttpGet("GetUsers")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                if(!IsAdmin)
                {
                    return Unauthorized(new { message = "You are not authorized to access this resource" });
                }
                var users = await _userService.GetUsersAsync();

                var userList = users.Select(user => new UserResponse
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    DateOfBirth = user.DateOfBirth,
                    PhoneNumber = user.PhoneNumber,
                    IsActive = user.IsActive,
                    IsAdmin = user.IsAdmin
                }).ToList();

                return Ok(userList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving users", error = ex.Message });
            }
        }

        [HttpDelete("Delete/{userId}")]
        public async Task<IActionResult> DeleteUser(Guid userId)
        {
            if(!IsAdmin)
            {
                return Unauthorized(new { message = "You are not authorized to access this resource" });
            }
            try
            {
                var deleted = await _userService.DeleteUserAsync(userId);

                if (!deleted)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(new { message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the user", error = ex.Message });
            }
        }
    }
}
