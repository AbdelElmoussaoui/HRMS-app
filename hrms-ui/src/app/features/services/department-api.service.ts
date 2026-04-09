import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiBaseService } from '../../core/services/api-base.service';
import {
  DepartmentCreateRequest,
  DepartmentResponse,
  DepartmentUpdateRequest
} from '../models/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentApiService {
  private readonly basePath = '/departments';

  constructor(private api: ApiBaseService) {}

  getAll(): Observable<DepartmentResponse[]> {
    return this.api.get<DepartmentResponse[]>(this.basePath);
  }

  getById(id: number): Observable<DepartmentResponse> {
    return this.api.get<DepartmentResponse>(`${this.basePath}/${id}`);
  }

  create(request: DepartmentCreateRequest): Observable<DepartmentResponse> {
    return this.api.post<DepartmentResponse>(this.basePath, request);
  }

  update(id: number, request: DepartmentUpdateRequest): Observable<DepartmentResponse> {
    return this.api.put<DepartmentResponse>(`${this.basePath}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.basePath}/${id}`);
  }
}
