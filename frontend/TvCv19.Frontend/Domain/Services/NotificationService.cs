using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using WebPush;

namespace TvCv19.Frontend.Domain.Services
{
    public interface INotificationService
    {
        Task SendNotification(string subscriberId, PushNotification notification = null);
    }

    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private JsonSerializerOptions serializerOptions = new JsonSerializerOptions() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase, IgnoreNullValues = true, PropertyNameCaseInsensitive = true };

        public NotificationService(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }
        public async Task SendNotification(string subscriberId, PushNotification notification = null)
        {
            var subs = await _notificationRepository.GetSubscriptions(subscriberId);
            var pushSubs = new List<PushSubscription>();
            if (subs != null)
            {
                pushSubs.AddRange(subs.Select(s => new PushSubscription(s.Endpoint, s.Keys.p256dh, s.Keys.auth)));
            }

            var options = new Dictionary<string, object>()
            {
                ["vapidDetails"] = new VapidDetails(@"mailto:example@example.com", "BFzDE_amkbsU-zXrDw6lZC6xGrHGXQVEWhTrGOTTU2s_d9MzQG4bPTXNR6PfNGu2fcLIw8qQHLwXUplANAMGKaA", "IRjMAQvRFiFEiFWuAGqlO9la6dd8jvrRVt-JMVLbnqw") { }
            };

            var webPushClient = new WebPushClient();
            var payload = new NotificationPayload
            {
                Notification = notification
            };
            try
            {
                foreach (var subscription in pushSubs)
                {
                    await webPushClient.SendNotificationAsync(subscription, JsonSerializer.Serialize(payload, serializerOptions), options);
                }
            }
            catch (WebPushException exception)
            {
                Console.WriteLine("Http STATUS code" + exception.StatusCode);
            }

        }

        
    }

    public class NotificationPayload
    {
        public PushNotification Notification { get; set; }
    }

    public class PushNotification
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public string Icon => "assets/icons/medecc-logo-72x72.png";
        public int[] Vibrate => new[] { 100, 50, 100 };
        public NotificationData Data { get; set; }
    }

    public class NotificationData
    {
        public string Url { get; set; }
        public string Id { get; set; }
    }
}
