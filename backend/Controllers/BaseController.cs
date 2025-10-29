using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CourseManagement.Controllers
{
    [Authorize]
    public abstract class BaseController : ControllerBase
    {
        protected Guid LoggedInUserId
        {
            get
            {
                var userIdClaim = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                {
                    throw new UnauthorizedAccessException("Invalid user ID in token");
                }
                return userId;
            }
        }

        protected bool IsAdmin
        {
            get
            {
                var isAdminClaim = User.FindFirst("isAdmin")?.Value;
                return bool.TryParse(isAdminClaim, out var isAdmin) && isAdmin;
            }
        }

        protected string LoggedInUserName
        {
            get
            {
                return User.FindFirst(ClaimTypes.Name)?.Value ?? string.Empty;
            }
        }

        protected string LoggedInUserEmail
        {
            get
            {
                return User.FindFirst(ClaimTypes.Email)?.Value ?? string.Empty;
            }
        }
    }
}
