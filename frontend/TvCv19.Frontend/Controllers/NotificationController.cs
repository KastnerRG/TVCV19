using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TvCv19.Frontend.Domain;
using TvCv19.Frontend.Domain.Services;

namespace TvCv19.Frontend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/notification")]
    public class NotificationController : Controller
    {
        private ILogger<NotificationController> _logger;
        private readonly INotificationService _notificationService;
        private INotificationRepository _notificationRepository;

        public NotificationController(INotificationRepository notificationRepository, ILogger<NotificationController> logger, INotificationService notificationService)
        {
            _logger = logger;
            _notificationService = notificationService;
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

         [HttpPost("{recieverId}/push")]
        public async Task<IActionResult> AddPush(string recieverId, [FromBody]Subscription subscription)
        {
            subscription.Id = recieverId;
            await _notificationRepository.AddPushSubscription(subscription);
            return Ok();
        }

        [HttpGet("{recieverId}/push")]
        public async Task<IActionResult> Push(string recieverId)
        {
            await _notificationService.SendNotification(recieverId, new PushNotification { Title = "Test", Body = "Not bad"});
            return Ok("Should of sent");
        }
    }
}
