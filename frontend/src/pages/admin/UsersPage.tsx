import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelectors';
import { createUser, fetchUsers } from '@/features/users/userSlice';
import { createUserSchema } from '@/utils/validationSchemas';

type UserForm = z.infer<typeof createUserSchema>;

export const UsersPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.users);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UserForm>({ resolver: zodResolver(createUserSchema) });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const onSubmit = (values: UserForm) => {
    dispatch(createUser(values))
      .unwrap()
      .then(() => reset());
  };

  return (
    <div className="page-stack">
      <h2>Team members</h2>
      {error && <div className="error-banner">{error}</div>}
      <div className="card">
        <form className="form-grid two-cols" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label>Full name</label>
            <input {...register('fullName')} />
            {errors.fullName && <small className="error-text">{errors.fullName.message}</small>}
          </div>
          <div className="form-control">
            <label>Email</label>
            <input type="email" {...register('email')} />
            {errors.email && <small className="error-text">{errors.email.message}</small>}
          </div>
          <div className="form-control">
            <label>Password</label>
            <input type="password" {...register('password')} />
            {errors.password && <small className="error-text">{errors.password.message}</small>}
          </div>
          <div className="form-control">
            <label>Role</label>
            <select {...register('role')}>
              {['employee', 'manager', 'hr', 'finance', 'admin'].map((role) => (
                <option key={role} value={role}>
                  {role.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label>Phone</label>
            <input {...register('phone')} />
          </div>
          <div className="form-control">
            <label>Department</label>
            <input {...register('department')} />
          </div>
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Invite user'}
          </button>
        </form>
      </div>

      <table className="table" style={{ marginTop: '1.5rem' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((user) => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.role.toUpperCase()}</td>
              <td>
                <span className={`badge ${user.status === 'active' ? 'approved' : 'rejected'}`}>{user.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

