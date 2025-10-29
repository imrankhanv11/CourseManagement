using System;
using System.Collections.Generic;

namespace CourseManagement.Models;

public partial class User
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public DateOnly? DateOfBirth { get; set; }

    public string? PhoneNumber { get; set; }

    public string Password { get; set; } = null!;

    public bool IsActive { get; set; }

    public bool IsAdmin { get; set; }

    public DateTime? CreatedOn { get; set; }

    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}
