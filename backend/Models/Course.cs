using System;
using System.Collections.Generic;

namespace CourseManagement.Models;

public partial class Course
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int DurationInMonths { get; set; }

    public DateOnly StartDate { get; set; }

    public int MinimumRequiredAge { get; set; }

    public DateTime? CreatedOn { get; set; }

    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}
