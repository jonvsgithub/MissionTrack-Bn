import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelectors';
import { approveOrganization, fetchPendingOrganizations } from '@/features/organizations/organizationSlice';

export const OrganizationApprovalsPage = () => {
  const dispatch = useAppDispatch();
  const { pending, loading, error } = useAppSelector((state) => state.organizations);

  useEffect(() => {
    dispatch(fetchPendingOrganizations());
  }, [dispatch]);

  return (
    <div className="page-stack">
      <h2>Pending organizations</h2>
      {loading && <p>Loading...</p>}
      {error && <div className="error-banner">{error}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Sector</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pending.map((org) => (
            <tr key={org.id}>
              <td>{org.name}</td>
              <td>{org.sector}</td>
              <td>
                {org.contactPersonName} • {org.contactPersonEmail}
              </td>
              <td>
                <span className="badge pending">{org.status}</span>
              </td>
              <td>
                <button className="primary-btn" onClick={() => dispatch(approveOrganization(org.id))}>
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

