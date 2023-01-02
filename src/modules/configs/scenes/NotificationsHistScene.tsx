import { NotificationItem } from '@/models/common/NotificationItem';
import { NotificationService } from '@/services/NotificationService';
import useEffectAsync from '@/utils/reactjs/hooks/useEffectAsync';
import React, { useState } from 'react';
import './NotificationsHistScene.scss';

const NotificationsHistScene: React.FC = () => {
  // Dependencies

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Effects

  useEffectAsync(async () => {
    setNotifications(await NotificationService.histGetAll());
  }, []);

  // Callbacks

  const removeItem = async (id: number) => {
    await NotificationService.histRemove(id);
    setNotifications(await NotificationService.histGetAll());
  };

  // Components

  const notificationsComponent = notifications.map((e, i) => (
    <div className="notification-item" key={i}>
      <span>{e.type} &nbsp; {e.message} &nbsp; {e.date.toISOString()}</span>
      <b onClick={() => removeItem(e.id)}>&nbsp; X</b>
    </div>
  ));

  // Render

  return (
    <div id="notifications-hist">
      <div className="notifications-wrapper">
        {notificationsComponent}
      </div>
    </div>
  );
};

export default NotificationsHistScene;
