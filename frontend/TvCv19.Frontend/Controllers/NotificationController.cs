using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TvCv19.Frontend.Domain;

namespace TvCv19.Frontend.Controllers
{
    [Authorize(Roles = "physician")]
    [ApiController]
    [Route("api/notification")]
    public class NotificationController : Controller
    {
        private ILogger<NotificationController> _logger;
        private INotificationRepository _notificationRepository;

        public NotificationController(INotificationRepository notificationRepository, ILogger<NotificationController> logger)
        {
            _logger = logger;
            _notificationRepository = notificationRepository;
        }

        [HttpPost]
        public async Task<IActionResult> Add(Notification notification)
        {
            notification = await _notificationRepository.AddNotification(notification);
            return Ok(notification);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            id = await _notificationRepository.DeleteNotification(id);
            return Ok(new {id});
        }

        [HttpGet("{recieverId}")]
        public async Task<IActionResult> Get(string recieverId)
        {
            var notifications = await _notificationRepository.GetNotifications(recieverId);
            return Ok(notifications);
        }
    }
}
