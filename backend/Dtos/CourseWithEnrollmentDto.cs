using System.ComponentModel.DataAnnotations;

namespace CourseManagement.Dtos
{
    public class CourseWithEnrollmentDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int DurationInMonths { get; set; }
        public DateOnly StartDate { get; set; }
        public int MinimumRequiredAge { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int EnrolledUsersCount { get; set; }
        public bool IsEnrolled { get; set; }
    }
}
