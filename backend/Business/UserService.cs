using Microsoft.EntityFrameworkCore;
using CourseManagement.Models;
using CourseManagement.Dtos;

namespace CourseManagement.Business
{
    public interface IUserService
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<User> CreateUserAsync(UserDto userDto);
        Task<User> UpdateUserAsync(UserDto userDto);
        Task<bool> DeleteUserAsync(Guid userId);
        Task<bool> UserExistsAsync(string email);
        Task<List<User>> GetUsersAsync();
    }

    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> CreateUserAsync(UserDto userDto)
        {
            var user = new User
            {
                Id = Guid.NewGuid(), // Ignore userDto.Id for create
                Name = userDto.Name,
                Email = userDto.Email,
                DateOfBirth = userDto.DateOfBirth,
                PhoneNumber = userDto.PhoneNumber,
                Password = userDto.Password ?? string.Empty, // Required for create
                IsActive = userDto.IsActive,
                IsAdmin = userDto.IsAdmin,
                CreatedOn = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<User> UpdateUserAsync(UserDto userDto)
        {
            var user = await _context.Users.FindAsync(userDto.Id);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }

            user.Name = userDto.Name;
            user.Email = userDto.Email;
            user.DateOfBirth = userDto.DateOfBirth;
            user.PhoneNumber = userDto.PhoneNumber;
            user.IsActive = userDto.IsActive;
            user.IsAdmin = userDto.IsAdmin;

            // Only update password if provided
            if (!string.IsNullOrEmpty(userDto.Password))
            {
                user.Password = userDto.Password; // In production, this should be hashed
            }

            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteUserAsync(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return false;
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<User>> GetUsersAsync()
        {
            return await _context.Users
                .Where(u => u.IsAdmin == false)
                .OrderBy(u => u.Name)
                .ToListAsync();
        }

        public async Task<bool> UserExistsAsync(string email)
        {
            return await _context.Users
                .AnyAsync(u => u.Email == email);
        }
    }
}
