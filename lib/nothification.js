function sendNotification(text, options = {}) {
  if (typeof window !== "undefined") {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      let notification = new Notification(text, options);
      setTimeout(notification.close.bind(notification), 4000);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission(function(permission) {
        if (permission === "granted") {
          let notification = new Notification(text, options);
          setTimeout(notification.close.bind(notification), 4000);
        }
      });
    }
  }
}

export default sendNotification;
