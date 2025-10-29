using Microsoft.EntityFrameworkCore;
using CourseManagement.Models;
using CourseManagement.Dtos;

namespace CourseManagement.Business
{
    public interface IEnrollmentService
    {
        Task<Enrollment> EnrollUserAsync(Guid userId, int courseId);
        Task<bool> IsUserEnrolledAsync(Guid userId, int courseId);
        Task<List<Enrollment>> GetUserEnrollmentsAsync(Guid userId);
        Task<bool> RemoveEnrollmentAsync(Guid userId, int courseId);
    }

    public class EnrollmentService : IEnrollmentService
    {
        private readonly AppDbContext _context;
        private readonly ICourseService _courseService;

        public EnrollmentService(AppDbContext context, ICourseService courseService)
        {
            _context = context;
            _courseService = courseService;
        }

        public async Task<Enrollment> EnrollUserAsync(Guid userId, int courseId)
        {
            // Validate that the course exists
            var courseExists = await _courseService.CourseExistsAsync(courseId);
            if (!courseExists)
            {
                throw new ArgumentException("Course not found");
            }

            // Check if user is already enrolled in this course
            var existingEnrollment = await IsUserEnrolledAsync(userId, courseId);
            if (existingEnrollment)
            {
                throw new InvalidOperationException("User is already enrolled in this course");
            }

            // Create new enrollment
            var enrollment = new Enrollment
            {
                UserId = userId,
                CourseId = courseId,
                EnrolledOn = DateTime.UtcNow
            };

            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            return enrollment;
        }

        public async Task<bool> IsUserEnrolledAsync(Guid userId, int courseId)
        {
            return await _context.Enrollments
                .AnyAsync(e => e.UserId == userId && e.CourseId == courseId);
        }

        public async Task<List<Enrollment>> GetUserEnrollmentsAsync(Guid userId)
        {
            return await _context.Enrollments
                .Include(e => e.Course)
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.EnrolledOn)
                .ToListAsync();
        }

        public async Task<bool> RemoveEnrollmentAsync(Guid userId, int courseId)
        {
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == courseId);

            if (enrollment == null)
            {
                return false; // Enrollment not found
            }

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
