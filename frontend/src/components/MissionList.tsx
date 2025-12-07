import React, { useState, useEffect } from 'react';
import { missionService } from '../services/missionService';

interface Mission {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: string;
}

interface Props {
  onSelectMission: (mission: Mission) => void;
  refreshTrigger: number;
}

export const MissionList: React.FC<Props> = ({ onSelectMission, refreshTrigger }) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMissions();
  }, [refreshTrigger]);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const response = await missionService.listMissions();
      setMissions(response.data.data || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load missions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading missions...</div>;

  return (
    <div className="p-4">
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
      
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2 text-left">Title</th>
            <th className="border p-2 text-left">Status</th>
            <th className="border p-2 text-left">Created By</th>
            <th className="border p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {missions.map((mission) => (
            <tr key={mission._id} className="hover:bg-gray-100">
              <td className="border p-2">{mission.title}</td>
              <td className="border p-2">
                <span className={`px-2 py-1 rounded text-white text-sm ${
                  mission.status === 'approved' ? 'bg-green-500' :
                  mission.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                }`}>
                  {mission.status.toUpperCase()}
                </span>
              </td>
              <td className="border p-2">{mission.createdBy}</td>
              <td className="border p-2">
                <button
                  onClick={() => onSelectMission(mission)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {missions.length === 0 && !loading && (
        <div className="text-center p-4 text-gray-500">No missions found</div>
      )}
    </div>
  );
};
