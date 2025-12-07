import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelectors';
import { fetchNotifications, markNotificationRead } from '@/features/notifications/notificationSlice';
import dayjs from 'dayjs';

export const NotificationsPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="page-stack">
      <h2>Notifications</h2>
      {loading && <p>Loading...</p>}
      <div className="card">
        {items.length === 0 ? (
          <p>You have no notifications.</p>
        ) : (
          <ul>
            {items.map((notification) => (
              <li key={notification.id} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{notification.title}</strong>
                  <small>{dayjs(notification.createdAt).format('MMM D, HH:mm')}</small>
                </div>
                <p>{notification.message}</p>
                {!notification.isRead && (
                  <button className="outline-btn" onClick={() => dispatch(markNotificationRead(notification.id))}>
                    Mark as read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

