using System.ComponentModel.DataAnnotations;

namespace CourseManagement.Dtos
{
    public class CourseDto
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Range(1, 60)]
        public int DurationInMonths { get; set; }

        [Required]
        public DateOnly StartDate { get; set; }

        [Required]
        [Range(1, 100)]
        public int MinimumRequiredAge { get; set; }
    }
}
