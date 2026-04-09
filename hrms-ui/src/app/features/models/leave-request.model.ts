export interface LeaveRequestResponse {
  id: number;
  employeeId: number;
  employeeName?: string;
  type: 'ANNUAL' | 'SICK' | 'UNPAID';
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason: string;
}

export interface LeaveRequestCreateRequest {
  employeeId: number;
  type: 'ANNUAL' | 'SICK' | 'UNPAID';
  startDate: string;
  endDate: string;
  reason: string;
}

export interface LeaveRequestUpdateRequest {
  type?: 'ANNUAL' | 'SICK' | 'UNPAID';
  startDate?: string;
  endDate?: string;
  reason?: string;
}
