import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelectors';
import { fetchMissions, decideOnMission } from '@/features/missions/missionsSlice';
import { apiClient } from '@/services/apiClient';

export const MissionDetailPage = () => {
  const { missionId } = useParams();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.missions);
  const { user } = useAppSelector((state) => state.auth);

  const mission = items.find((m) => m.id === missionId);

  const [expenseMessage, setExpenseMessage] = useState<string | null>(null);
  const [fundMessage, setFundMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset: resetExpense
  } = useForm<{ expenseType: string; amount: number; receipt?: FileList }>();

  const {
    register: registerFund,
    handleSubmit: handleFundSubmit,
    reset: resetFund
  } = useForm<{ allocatedAmount: number }>();

  useEffect(() => {
    if (!missionId) return;
    if (!mission) {
      dispatch(fetchMissions());
    }
  }, [dispatch, missionId, mission]);

  if (!mission) {
    return <p>Loading mission...</p>;
  }

  const handleDecision = (action: 'approve' | 'reject') => {
    if (!missionId) return;
    dispatch(decideOnMission({ missionId, action }));
  };

  const submitExpense = handleSubmit(async (values) => {
    if (!missionId) return;
    const formData = new FormData();
    formData.append('expenseType', values.expenseType);
    formData.append('amount', values.amount.toString());
    if (values.receipt?.[0]) {
      formData.append('receipt', values.receipt[0]);
    }
    await apiClient.post(`/missions/${missionId}/expenses`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setExpenseMessage('Expense submitted for finance review.');
    resetExpense();
  });

  const submitFundAllocation = handleFundSubmit(async (values) => {
    if (!missionId) return;
    await apiClient.post(`/missions/${missionId}/fund-allocation`, {
      allocatedAmount: Number(values.allocatedAmount)
    });
    setFundMessage('Funds allocated successfully.');
    resetFund();
  });

  return (
    <div className="page-stack">
      <div className="card">
        <h2>{mission.purpose}</h2>
        <p className="page-subtitle">{mission.destination}</p>
        <div className="badge pending">{mission.status.replace(/_/g, ' ')}</div>
        <p>
          Travel window: {mission.startDate} → {mission.endDate}
        </p>
        <p>Estimated cost: ${mission.estimatedCost.toLocaleString()}</p>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          {['manager', 'hr', 'finance'].includes(user?.role || '') && mission.status.startsWith('pending') && (
            <>
              <button className="primary-btn" onClick={() => handleDecision('approve')}>
                Approve
              </button>
              <button className="outline-btn" onClick={() => handleDecision('reject')}>
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      {user?.role === 'employee' && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3>Submit expenses</h3>
          <form className="form-grid" onSubmit={submitExpense}>
            <div className="form-control">
              <label>Expense type</label>
              <input placeholder="Accommodation, meals..." {...register('expenseType')} />
            </div>
            <div className="form-control">
              <label>Amount</label>
              <input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} />
            </div>
            <div className="form-control">
              <label>Receipt</label>
              <input type="file" accept="application/pdf,image/*" {...register('receipt')} />
            </div>
            <button className="primary-btn" type="submit">
              Submit expense
            </button>
            {expenseMessage && <span className="success-banner">{expenseMessage}</span>}
          </form>
        </div>
      )}

      {user?.role === 'finance' && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3>Allocate funds</h3>
          <form className="form-grid" onSubmit={submitFundAllocation}>
            <div className="form-control">
              <label>Allocation amount</label>
              <input type="number" step="0.01" {...registerFund('allocatedAmount', { valueAsNumber: true })} />
            </div>
            <button className="primary-btn" type="submit">
              Allocate
            </button>
            {fundMessage && <span className="success-banner">{fundMessage}</span>}
          </form>
        </div>
      )}
    </div>
  );
};

