import { useEffect, useMemo } from 'react';
import { fetchMissions } from '@/features/missions/missionsSlice';
import { fetchNotifications } from '@/features/notifications/notificationSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelectors';
import dayjs from 'dayjs';

export const OverviewPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.missions);
  const notifications = useAppSelector((state) => state.notifications.items);

  useEffect(() => {
    dispatch(fetchMissions());
    dispatch(fetchNotifications());
  }, [dispatch]);

  const metrics = useMemo(() => {
    const total = items.length;
    const approved = items.filter((m) => m.status === 'approved').length;
    const pending = items.filter((m) => m.status.startsWith('pending')).length;
    const rejected = items.filter((m) => m.status === 'rejected').length;
    return { total, approved, pending, rejected };
  }, [items]);

  return (
    <div className="page-stack">
      <div className="card-grid">
        <div className="card">
          <p className="card-title">Total Missions</p>
          <p className="card-value">{metrics.total}</p>
        </div>
        <div className="card">
          <p className="card-title">Approved</p>
          <p className="card-value">{metrics.approved}</p>
        </div>
        <div className="card">
          <p className="card-title">Pending Workflow</p>
          <p className="card-value">{metrics.pending}</p>
        </div>
        <div className="card">
          <p className="card-title">Rejected</p>
          <p className="card-value">{metrics.rejected}</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="section-header">
          <h3>Latest Missions</h3>
        </div>
        {loading ? (
          <p>Loading missions...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Purpose</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Dates</th>
              </tr>
            </thead>
            <tbody>
              {items.slice(0, 5).map((mission) => (
                <tr key={mission.id}>
                  <td>{mission.purpose}</td>
                  <td>{mission.destination}</td>
                  <td>
                    <span className={`badge ${mission.status.includes('pending') ? 'pending' : mission.status}`}>
                      {mission.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    {dayjs(mission.startDate).format('MMM D')} - {dayjs(mission.endDate).format('MMM D')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="section-header">
          <h3>Recent Notifications</h3>
        </div>
        {notifications.length === 0 ? (
          <p>You are all caught up!</p>
        ) : (
          <ul>
            {notifications.slice(0, 5).map((notification) => (
              <li key={notification.id}>
                <strong>{notification.title}</strong> — {notification.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

