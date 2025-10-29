using System.ComponentModel.DataAnnotations;

namespace CourseManagement.Dtos
{
    public class RegisterUserDto
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(200, MinimumLength = 6)]
        public string Password { get; set; } = string.Empty;
    }
}
