using System.ComponentModel.DataAnnotations;

namespace CourseManagement.Dtos
{
    public class RefreshTokenRequest
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}
