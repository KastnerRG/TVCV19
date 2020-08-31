importScripts("./ngsw-worker.js");
self.addEventListener("notificationclick", (event) => {
  event.waitUntil(handleNotification(event.notification));
});
function handleNotification(notification) {
  return clients.matchAll().then((matchedClients) => {
    const url = new URL("/", location).href;
    for (let matchClient of matchedClients) {
      if (matchClient.url.startsWith(url)) {
        // return matchClient.focus();
        return matchClient.navigate(`${url}${notification["data"].url}`);
      }
    }
    return clients.openWindow(`${url}${notification["data"].url}`);
  });
}
