using Microsoft.EntityFrameworkCore;
using CourseManagement.Models;
using CourseManagement.Dtos;

namespace CourseManagement.Business
{
    public interface ICourseService
    {
        Task<Course> CreateCourseAsync(CourseDto courseDto);
        Task<Course> UpdateCourseAsync(CourseDto courseDto);
        Task<bool> DeleteCourseAsync(int courseId);
        Task<bool> CourseExistsAsync(int courseId);
        Task<List<CourseWithEnrollmentDto>> GetCoursesWithEnrollmentCountAsync(Guid userId);
    }

    public class CourseService : ICourseService
    {
        private readonly AppDbContext _context;

        public CourseService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Course> CreateCourseAsync(CourseDto courseDto)
        {
            var course = new Course
            {
                Name = courseDto.Name,
                DurationInMonths = courseDto.DurationInMonths,
                StartDate = courseDto.StartDate,
                MinimumRequiredAge = courseDto.MinimumRequiredAge,
                CreatedOn = DateTime.UtcNow
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return course;
        }

        public async Task<Course> UpdateCourseAsync(CourseDto courseDto)
        {
            var course = await _context.Courses.FindAsync(courseDto.Id);
            if (course == null)
            {
                throw new ArgumentException("Course not found");
            }

            course.Name = courseDto.Name;
            course.DurationInMonths = courseDto.DurationInMonths;
            course.StartDate = courseDto.StartDate;
            course.MinimumRequiredAge = courseDto.MinimumRequiredAge;

            await _context.SaveChangesAsync();
            return course;
        }

        public async Task<bool> DeleteCourseAsync(int courseId)
        {
            var course = await _context.Courses.FindAsync(courseId);
            if (course == null)
            {
                return false;
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CourseExistsAsync(int courseId)
        {
            return await _context.Courses
                .AnyAsync(c => c.Id == courseId);
        }

        public async Task<List<CourseWithEnrollmentDto>> GetCoursesWithEnrollmentCountAsync(Guid userId)
        {
            var courses = await _context.Courses
                .Include(c => c.Enrollments)
                .OrderBy(c => c.Name)
                .Select(c => new CourseWithEnrollmentDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    DurationInMonths = c.DurationInMonths,
                    StartDate = c.StartDate,
                    MinimumRequiredAge = c.MinimumRequiredAge,
                    CreatedOn = c.CreatedOn,
                    EnrolledUsersCount = c.Enrollments.Count,
                    IsEnrolled = c.Enrollments.Any(e => e.UserId == userId)
                })
                .ToListAsync();

            return courses;
        }
    }
}
