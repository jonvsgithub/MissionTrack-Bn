import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { registerOrganizationSchema } from '@/utils/validationSchemas';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelectors';
import { registerOrganization } from '@/features/auth/authSlice';

type RegisterOrgForm = z.infer<typeof registerOrganizationSchema> & {
  proofDocument?: FileList;
};

export const RegisterOrganizationPage = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegisterOrgForm>({
    resolver: zodResolver(registerOrganizationSchema)
  });

  const onSubmit = (values: RegisterOrgForm) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'proofDocument') return;
      formData.append(key, value as string);
    });
    if (values.proofDocument?.[0]) {
      formData.append('proofDocument', values.proofDocument[0]);
    }
    dispatch(registerOrganization(formData))
      .unwrap()
      .then(() => {
        setSuccessMessage('Request submitted. Our admin team will contact you soon.');
        reset();
      })
      .catch(() => setSuccessMessage(null));
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <div className="brand auth-brand">
          <span className="brand-accent">Mission</span>Track
        </div>
        <h2>Register Organization</h2>
        <p className="page-subtitle">Provide your company details for onboarding.</p>

        <div className="form-grid two-cols">
          {[
            { name: 'name', label: 'Organization Name' },
            { name: 'sector', label: 'Sector' },
            { name: 'province', label: 'Province' },
            { name: 'district', label: 'District' },
            { name: 'email', label: 'Company Email', type: 'email' },
            { name: 'phone', label: 'Company Phone' }
          ].map((field) => (
            <div className="form-control" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              <input id={field.name} type={field.type || 'text'} {...register(field.name as keyof RegisterOrgForm)} />
              {errors[field.name as keyof RegisterOrgForm] && (
                <small className="error-text">
                  {errors[field.name as keyof RegisterOrgForm]?.message as string}
                </small>
              )}
            </div>
          ))}
        </div>

        <div className="form-grid two-cols">
          {[
            { name: 'contactPersonName', label: 'Contact Person' },
            { name: 'contactPersonPhone', label: 'Contact Phone' },
            { name: 'contactPersonEmail', label: 'Contact Email', type: 'email' },
            { name: 'password', label: 'Portal Password', type: 'password' }
          ].map((field) => (
            <div className="form-control" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              <input id={field.name} type={field.type || 'text'} {...register(field.name as keyof RegisterOrgForm)} />
              {errors[field.name as keyof RegisterOrgForm] && (
                <small className="error-text">
                  {errors[field.name as keyof RegisterOrgForm]?.message as string}
                </small>
              )}
            </div>
          ))}
        </div>

        <div className="form-control">
          <label htmlFor="proofDocument">Proof of registration (PDF)</label>
          <input id="proofDocument" type="file" accept="application/pdf" {...register('proofDocument')} />
        </div>

        {error && <div className="error-banner">{error}</div>}
        {successMessage && <div className="success-banner">{successMessage}</div>}

        <button type="submit" className="primary-btn" disabled={status === 'loading'}>
          {status === 'loading' ? 'Submitting...' : 'Submit request'}
        </button>

        <p className="auth-helper">
          Already approved?{' '}
          <Link to="/login" className="link">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

