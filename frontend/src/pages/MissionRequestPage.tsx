import React, { useState } from 'react';
import { MissionList } from '../components/MissionList';
import { MissionDetails } from '../components/MissionDetails';
import { MissionForm } from '../components/MissionForm';

type View = 'list' | 'details' | 'form';

interface Mission {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdBy: string;
  createdAt: string;
}

export const MissionRequestPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedMissionId, setSelectedMissionId] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectMission = (mission: Mission) => {
    setSelectedMissionId(mission._id);
    setCurrentView('details');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedMissionId('');
  };

  const handleCreateMissionClick = () => {
    setCurrentView('form');
  };

  const handleFormSuccess = () => {
    setCurrentView('list');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleActionComplete = () => {
    setCurrentView('list');
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mission Request Management</h1>

        {currentView === 'list' && (
          <div>
            <button
              onClick={handleCreateMissionClick}
              className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              + Create New Mission
            </button>
            <MissionList
              onSelectMission={handleSelectMission}
              refreshTrigger={refreshTrigger}
            />
          </div>
        )}

        {currentView === 'details' && (
          <MissionDetails
            missionId={selectedMissionId}
            onBack={handleBackToList}
            onActionComplete={handleActionComplete}
          />
        )}

        {currentView === 'form' && (
          <MissionForm
            onSubmitSuccess={handleFormSuccess}
            onCancel={handleBackToList}
          />
        )}
      </div>
    </div>
  );
};
