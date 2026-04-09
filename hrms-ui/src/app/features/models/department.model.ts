export interface DepartmentResponse {
  id: number;
  name: string;
  description?: string;
}

export interface DepartmentCreateRequest {
  name: string;
  description?: string;
}

export interface DepartmentUpdateRequest {
  name?: string;
  description?: string;
}
