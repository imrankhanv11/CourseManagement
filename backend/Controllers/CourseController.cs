using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CourseManagement.Business;
using CourseManagement.Dtos;
using CourseManagement.Models;
using Microsoft.AspNetCore.Authorization;

namespace CourseManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : BaseController
    {
        private readonly ICourseService _courseService;

        public CourseController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpPost("Add")]
        public async Task<IActionResult> AddCourse([FromBody] CourseDto courseDto)
        {
            if(!IsAdmin)
            {
                return Unauthorized(new { message = "You are not authorized to access this resource" });
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var course = await _courseService.CreateCourseAsync(courseDto);

                return Ok(new
                {
                    message = "Course added successfully",
                    course = new
                    {
                        id = course.Id,
                        name = course.Name,
                        durationInMonths = course.DurationInMonths,
                        startDate = course.StartDate,
                        minimumRequiredAge = course.MinimumRequiredAge,
                        createdOn = course.CreatedOn
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding the course", error = ex.Message });
            }
        }

        [HttpPut("Edit")]
        public async Task<IActionResult> EditCourse([FromBody] CourseDto courseDto)
        {
            if(!IsAdmin)
            {
                return Unauthorized(new { message = "You are not authorized to access this resource" });
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var course = await _courseService.UpdateCourseAsync(courseDto);

                return Ok(new
                {
                    message = "Course updated successfully",
                    course = new
                    {
                        id = course.Id,
                        name = course.Name,
                        durationInMonths = course.DurationInMonths,
                        startDate = course.StartDate,
                        minimumRequiredAge = course.MinimumRequiredAge,
                        createdOn = course.CreatedOn
                    }
                });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the course", error = ex.Message });
            }
        }

        [HttpDelete("Delete/{courseId}")]
        public async Task<IActionResult> DeleteCourse(int courseId)
        {
            if(!IsAdmin)
            {
                return Unauthorized(new { message = "You are not authorized to access this resource" });
            }
            try
            {
                var deleted = await _courseService.DeleteCourseAsync(courseId);

                if (!deleted)
                {
                    return NotFound(new { message = "Course not found" });
                }

                return Ok(new { message = "Course deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the course", error = ex.Message });
            }
        }

        [HttpGet("GetCourses")]
        public async Task<IActionResult> GetCourses()
        {
            try
            {
                var courses = await _courseService.GetCoursesWithEnrollmentCountAsync(LoggedInUserId);

                return Ok(courses);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving courses", error = ex.Message });
            }
        }
    }
}
