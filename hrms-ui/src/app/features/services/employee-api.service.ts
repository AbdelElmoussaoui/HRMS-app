import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiBaseService } from '../../core/services/api-base.service';
import {
  EmployeeCreateRequest,
  EmployeeResponse,
  EmployeeUpdateRequest
} from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeApiService {
  private readonly basePath = '/employees';

  constructor(private api: ApiBaseService) {}

  getAll(): Observable<EmployeeResponse[]> {
    return this.api.get<EmployeeResponse[]>(this.basePath);
  }

  getById(id: number): Observable<EmployeeResponse> {
    return this.api.get<EmployeeResponse>(`${this.basePath}/${id}`);
  }

  create(request: EmployeeCreateRequest): Observable<EmployeeResponse> {
    return this.api.post<EmployeeResponse>(this.basePath, request);
  }

  update(id: number, request: EmployeeUpdateRequest): Observable<EmployeeResponse> {
    return this.api.put<EmployeeResponse>(`${this.basePath}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.basePath}/${id}`);
  }
}
