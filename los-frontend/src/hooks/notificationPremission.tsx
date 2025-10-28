import { useState } from 'react';

const NotificationPermission = () => {
  const [permission, setPermission] = useState(Notification.permission);

  const requestPermission = () => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        setPermission(permission);
      });
    }
  };

  return (
    <div>
      <button onClick={requestPermission}>Enable Notifications</button>
      <p>Notification permission: {permission}</p>
    </div>
  );
};

export default NotificationPermission;
