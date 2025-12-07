import React, { useState, useEffect } from 'react';
import { missionService } from '../services/missionService';
import { MissionDecisionModal } from './MissionDecisionModal';

interface Mission {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: string;
}

interface Props {
  missionId: string;
  onBack: () => void;
  onActionComplete: () => void;
}

export const MissionDetails: React.FC<Props> = ({ missionId, onBack, onActionComplete }) => {
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionType, setDecisionType] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    fetchMissionDetails();
  }, [missionId]);

  const fetchMissionDetails = async () => {
    try {
      setLoading(true);
      const response = await missionService.getMissionById(missionId);
      setMission(response.data.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load mission details');
    } finally {
      setLoading(false);
    }
  };

  const handleDecisionClick = (type: 'approve' | 'reject') => {
    setDecisionType(type);
    setShowDecisionModal(true);
  };

  const handleDecisionSubmit = async (reason: string) => {
    if (!mission || !decisionType) return;

    try {
      const data = { reason };
      if (decisionType === 'approve') {
        await missionService.approveMission(mission._id, data);
      } else {
        await missionService.rejectMission(mission._id, data);
      }
      setShowDecisionModal(false);
      onActionComplete();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Action failed');
    }
  };

  if (loading) return <div className="p-4">Loading mission details...</div>;

  if (!mission) return <div className="p-4 text-red-500">Mission not found</div>;

  return (
    <div className="p-6 max-w-2xl bg-white rounded shadow">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <button
        onClick={onBack}
        className="mb-4 text-blue-500 hover:underline"
      >
        ← Back to List
      </button>

      <h2 className="text-2xl font-bold mb-4">{mission.title}</h2>

      <div className="space-y-3 mb-6">
        <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-white text-sm ${
          mission.status === 'approved' ? 'bg-green-500' :
          mission.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
        }`}>{mission.status.toUpperCase()}</span></p>
        <p><strong>Created By:</strong> {mission.createdBy}</p>
        <p><strong>Created At:</strong> {new Date(mission.createdAt).toLocaleDateString()}</p>
        <p><strong>Description:</strong></p>
        <p className="bg-gray-100 p-3 rounded">{mission.description}</p>
      </div>

      {mission.status === 'pending' && (
        <div className="flex gap-3">
          <button
            onClick={() => handleDecisionClick('approve')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Approve
          </button>
          <button
            onClick={() => handleDecisionClick('reject')}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      )}

      {showDecisionModal && decisionType && (
        <MissionDecisionModal
          type={decisionType}
          onSubmit={handleDecisionSubmit}
          onCancel={() => setShowDecisionModal(false)}
        />
      )}
    </div>
  );
};
