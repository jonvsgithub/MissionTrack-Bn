import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelectors';
import { decideOnMission, fetchMissions } from '@/features/missions/missionsSlice';

export const MissionListPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.missions);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMissions());
  }, [dispatch]);

  const canApprove = ['manager', 'hr', 'finance'].includes(user?.role ?? '');

  const handleDecision = (missionId: string, action: 'approve' | 'reject') => {
    dispatch(decideOnMission({ missionId, action }));
  };

  return (
    <div className="page-stack">
      <div className="section-header">
        <h2>Missions</h2>
        <Link className="primary-btn" to="/app/missions/new">
          Create mission
        </Link>
      </div>
      {loading && <p>Loading missions...</p>}
      {error && <div className="error-banner">{error}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Budget</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((mission) => (
            <tr key={mission.id}>
              <td>{mission.purpose}</td>
              <td>{mission.destination}</td>
              <td>
                <span className={`badge ${mission.status.includes('pending') ? 'pending' : mission.status}`}>
                  {mission.status.replace(/_/g, ' ')}
                </span>
              </td>
              <td>{mission.duration} days</td>
              <td>${mission.estimatedCost.toLocaleString()}</td>
              <td style={{ display: 'flex', gap: '0.5rem' }}>
                <Link className="outline-btn" to={`/app/missions/${mission.id}`}>
                  View
                </Link>
                {canApprove && mission.status.startsWith('pending') && (
                  <>
                    <button className="primary-btn" onClick={() => handleDecision(mission.id, 'approve')}>
                      Approve
                    </button>
                    <button className="outline-btn" onClick={() => handleDecision(mission.id, 'reject')}>
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

