self.addEventListener('push', function(event) {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: 'POP Perote', body: event.data.text() };
  }

  const options = {
    body: data.body || '',
    icon: '/images/logopop.png',
    badge: '/images/logopop.png',
    data: data.data || {},
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'POP Perote', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://popgastropub.com')
  );
});
