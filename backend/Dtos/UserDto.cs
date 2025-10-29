using System.ComponentModel.DataAnnotations;

namespace CourseManagement.Dtos
{
    public class UserDto
    {
        public Guid Id { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;

        public DateOnly? DateOfBirth { get; set; }

        [StringLength(20)]
        public string? PhoneNumber { get; set; }

        [StringLength(200, MinimumLength = 6)]
        public string? Password { get; set; }

        public bool IsActive { get; set; } = true;

        public bool IsAdmin { get; set; } = false;
    }
}
