import React, { useState } from 'react';

interface Props {
  type: 'approve' | 'reject';
  onSubmit: (reason: string) => void;
  onCancel: () => void;
}

export const MissionDecisionModal: React.FC<Props> = ({ type, onSubmit, onCancel }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reason);
  };

  const isApprove = type === 'approve';
  const buttonColor = isApprove ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
  const title = isApprove ? 'Approve Mission' : 'Reject Mission';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">{title}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">
              {isApprove ? 'Approval Notes' : 'Rejection Reason'}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded h-32"
              placeholder={isApprove ? 'Add approval notes...' : 'Enter rejection reason...'}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className={`flex-1 text-white px-4 py-2 rounded ${buttonColor}`}
            >
              {isApprove ? 'Approve' : 'Reject'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
