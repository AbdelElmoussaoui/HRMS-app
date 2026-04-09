export interface EmployeeResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  hireDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TERMINATED';
  salary: number;
  userId?: number;
  departmentId?: number;
  departmentName?: string;
}

export interface EmployeeCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  hireDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TERMINATED';
  salary: number;
  userId?: number | null;
  departmentId?: number | null;
}

export interface EmployeeUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  hireDate?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TERMINATED';
  salary?: number;
  userId?: number | null;
  departmentId?: number | null;
}
