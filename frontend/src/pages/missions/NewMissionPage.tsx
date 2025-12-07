import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { missionSchema } from '@/utils/validationSchemas';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelectors';
import { createMission } from '@/features/missions/missionsSlice';

type MissionForm = z.input<typeof missionSchema>;

export const NewMissionPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.missions);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<MissionForm>({ resolver: zodResolver(missionSchema) });

  const onSubmit = (values: MissionForm) => {
    const payload = missionSchema.parse(values);
    dispatch(createMission(payload))
      .unwrap()
      .then((mission) => {
        reset();
        navigate(`/app/missions/${mission.id}`);
      });
  };

  return (
    <div className="card">
      <h2>Submit a mission request</h2>
      <form className="form-grid two-cols" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control">
          <label>Purpose</label>
          <input placeholder="Describe the mission" {...register('purpose')} />
          {errors.purpose && <small className="error-text">{errors.purpose.message}</small>}
        </div>
        <div className="form-control">
          <label>Destination</label>
          <input placeholder="City, Country" {...register('destination')} />
          {errors.destination && <small className="error-text">{errors.destination.message}</small>}
        </div>
        <div className="form-control">
          <label>Start date</label>
          <input type="date" {...register('startDate')} />
        </div>
        <div className="form-control">
          <label>End date</label>
          <input type="date" {...register('endDate')} />
        </div>
          <div className="form-control">
            <label>Duration (days)</label>
            <input type="number" {...register('duration')} />
          </div>
          <div className="form-control">
            <label>Estimated cost (USD)</label>
            <input type="number" {...register('estimatedCost')} />
          </div>
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create mission'}
        </button>
      </form>
    </div>
  );
};

