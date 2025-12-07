export type OrganizationStatus = 'pending' | 'approved' | 'rejected';
export type MissionStatus =
  | 'pending_manager'
  | 'pending_hr'
  | 'pending_finance'
  | 'approved'
  | 'rejected'
  | 'completed';

export interface Organization {
  id: string;
  name: string;
  province: string;
  district: string;
  sector: string;
  email: string;
  phone: string;
  contactPersonName: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
  proofDocument?: string | null;
  status: OrganizationStatus;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'employee' | 'manager' | 'hr' | 'finance' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  department?: string | null;
  role: UserRole;
  status: 'active' | 'disabled';
  organizationId?: string | null;
}

export interface MissionRequest {
  id: string;
  userId: string;
  organizationId: string;
  purpose: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  estimatedCost: number;
  status: MissionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MissionExpense {
  id: string;
  missionId: string;
  submittedBy: string;
  expenseType: string;
  amount: number;
  receiptFile?: string | null;
  status: 'pending_finance' | 'approved' | 'rejected';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

