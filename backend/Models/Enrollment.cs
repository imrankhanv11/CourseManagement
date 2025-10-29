using System;
using System.Collections.Generic;

namespace CourseManagement.Models;

public partial class Enrollment
{
    public int EnrollmentId { get; set; }

    public Guid UserId { get; set; }

    public int CourseId { get; set; }

    public DateTime EnrolledOn { get; set; }

    public virtual Course Course { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
