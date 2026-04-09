import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiBaseService } from '../../core/services/api-base.service';
import {
  LeaveRequestCreateRequest,
  LeaveRequestResponse,
  LeaveRequestUpdateRequest
} from '../models/leave-request.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestApiService {
  private readonly basePath = '/leave-requests';

  constructor(private api: ApiBaseService) {}

  getAll(): Observable<LeaveRequestResponse[]> {
    return this.api.get<LeaveRequestResponse[]>(this.basePath);
  }

  getByEmployee(employeeId: number): Observable<LeaveRequestResponse[]> {
    return this.api.get<LeaveRequestResponse[]>(`${this.basePath}?employeeId=${employeeId}`);
  }

  getById(id: number): Observable<LeaveRequestResponse> {
    return this.api.get<LeaveRequestResponse>(`${this.basePath}/${id}`);
  }

  create(request: LeaveRequestCreateRequest): Observable<LeaveRequestResponse> {
    return this.api.post<LeaveRequestResponse>(this.basePath, request);
  }

  update(id: number, request: LeaveRequestUpdateRequest): Observable<LeaveRequestResponse> {
    return this.api.put<LeaveRequestResponse>(`${this.basePath}/${id}`, request);
  }

  approve(id: number): Observable<LeaveRequestResponse> {
    return this.api.post<LeaveRequestResponse>(`${this.basePath}/${id}/approve`, {});
  }

  reject(id: number): Observable<LeaveRequestResponse> {
    return this.api.post<LeaveRequestResponse>(`${this.basePath}/${id}/reject`, {});
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.basePath}/${id}`);
  }
}
