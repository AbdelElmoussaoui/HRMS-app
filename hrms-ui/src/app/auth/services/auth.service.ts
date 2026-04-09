import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

import { ApiBaseService } from '../../core/services/api-base.service';
import { TokenStorageService } from './token-storage.service';

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthRequest {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authState$ = new BehaviorSubject<boolean>(!!this.tokenStorage.getToken());

  constructor(
    private api: ApiBaseService,
    private tokenStorage: TokenStorageService
  ) {}

  login(request: AuthRequest): Observable<void> {
    return this.api.post<AuthResponse>('/auth/login', request).pipe(
      map((response) => {
        this.tokenStorage.setToken(response.accessToken);
        this.authState$.next(true);
      })
    );
  }

  logout(): void {
    this.tokenStorage.clear();
    this.authState$.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState$.asObservable();
  }

  getToken(): string | null {
    return this.tokenStorage.getToken();
  }
}
