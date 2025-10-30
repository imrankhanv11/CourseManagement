using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CourseManagement.Business;
using CourseManagement.Dtos;
using CourseManagement.Models;

namespace CourseManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EnrollmentController : BaseController
    {
        private readonly IEnrollmentService _enrollmentService;

        public EnrollmentController(IEnrollmentService enrollmentService)
        {
            _enrollmentService = enrollmentService;
        }

        [HttpPost("Enroll")]
        public async Task<IActionResult> EnrollInCourse([FromBody] EnrollmentDto enrollmentDto)
        {
            if(IsAdmin)
            {
                return BadRequest(new { message = "You are not authorized to access this resource" });
            }
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var enrollment = await _enrollmentService.EnrollUserAsync(LoggedInUserId, enrollmentDto.CourseId);

                return Ok(new
                {
                    message = "Successfully enrolled in course",
                    enrollmentId = enrollment.EnrollmentId,
                    courseId = enrollment.CourseId,
                    enrolledOn = enrollment.EnrolledOn
                });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while enrolling in the course", error = ex.Message });
            }
        }

        [HttpGet("MyEnrollments")]
        public async Task<IActionResult> GetMyEnrollments()
        {
            try
            {
                var enrollments = await _enrollmentService.GetUserEnrollmentsAsync(LoggedInUserId);

                var enrollmentResponses = enrollments.Select(e => new
                {
                    enrollmentId = e.EnrollmentId,
                    courseId = e.CourseId,
                    courseName = e.Course.Name,
                    enrolledOn = e.EnrolledOn,
                    duration = e.Course.DurationInMonths,
                    startDate = e.Course.StartDate
                }).ToList();

                return Ok(enrollmentResponses);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving enrollments", error = ex.Message });
            }
        }

        [HttpDelete("Remove/{courseId}")]
        public async Task<IActionResult> RemoveEnrollment(int courseId)
        {
            if(IsAdmin)
            {
                return BadRequest(new { message = "You are not authorized to access this resource" });
            }
            try
            {
                var removed = await _enrollmentService.RemoveEnrollmentAsync(LoggedInUserId, courseId);

                if (!removed)
                {
                    return NotFound(new { message = "Enrollment not found" });
                }

                return Ok(new { message = "Successfully removed enrollment from course" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while removing enrollment", error = ex.Message });
            }
        }
    }
}
