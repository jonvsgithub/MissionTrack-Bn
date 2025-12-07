import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelectors';
import { loginSchema } from '@/utils/validationSchemas';
import { z } from 'zod';

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error, tokens } = useAppSelector((state) => state.auth);

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const from = (location.state as { from?: Location })?.from?.pathname || '/app/overview';

  useEffect(() => {
    if (tokens?.accessToken) {
      navigate('/app/overview', { replace: true });
    }
  }, [tokens, navigate]);

  const onSubmit = (values: LoginForm) => {
    dispatch(login(values))
      .unwrap()
      .then(() => navigate(from, { replace: true }));
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <div className="brand auth-brand">
          <span className="brand-accent">Mission</span>Track
        </div>
        <h2>Sign in</h2>
        <p className="page-subtitle">Access your mission dashboard</p>

        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="you@company.com" {...register('email')} />
          {errors.email && <small className="error-text">{errors.email.message}</small>}
        </div>

        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="••••••••" {...register('password')} />
          {errors.password && <small className="error-text">{errors.password.message}</small>}
        </div>

        {error && <div className="error-banner">{error}</div>}

        <button type="submit" className="primary-btn" disabled={status === 'loading'}>
          {status === 'loading' ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="auth-helper">
          New organization?{' '}
          <Link to="/register-organization" className="link">
            Request access
          </Link>
        </p>
      </form>
    </div>
  );
};

