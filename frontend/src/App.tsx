import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterOrganizationPage } from '@/pages/auth/RegisterOrganizationPage';
import { OverviewPage } from '@/pages/dashboard/OverviewPage';
import { MissionListPage } from '@/pages/missions/MissionListPage';
import { MissionDetailPage } from '@/pages/missions/MissionDetailPage';
import { NewMissionPage } from '@/pages/missions/NewMissionPage';
import { OrganizationApprovalsPage } from '@/pages/admin/OrganizationApprovalsPage';
import { UsersPage } from '@/pages/admin/UsersPage';
import { NotificationsPage } from '@/pages/notifications/NotificationsPage';
import { NotFoundPage } from '@/pages/misc/NotFoundPage';
import { RoleGuard } from '@/components/RoleGuard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-organization" element={<RegisterOrganizationPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<DashboardLayout />}>
          <Route path="overview" element={<OverviewPage />} />
          <Route path="missions" element={<MissionListPage />} />
          <Route path="missions/new" element={<NewMissionPage />} />
          <Route path="missions/:missionId" element={<MissionDetailPage />} />
          <Route
            path="admin/organizations"
            element={
              <RoleGuard allowed="admin">
                <OrganizationApprovalsPage />
              </RoleGuard>
            }
          />
          <Route
            path="admin/users"
            element={
              <RoleGuard allowed="admin">
                <UsersPage />
              </RoleGuard>
            }
          />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route index element={<Navigate to="overview" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
