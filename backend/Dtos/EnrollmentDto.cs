using System.ComponentModel.DataAnnotations;

namespace CourseManagement.Dtos
{
    public class EnrollmentDto
    {
        [Required]
        public int CourseId { get; set; }
    }
}
