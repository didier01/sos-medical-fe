import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  // Estado centralizado usando Signals
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly accessToken = signal<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  );

  register(payload: any): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/register`, payload).pipe(
      tap(res => this.handleAuthSuccess(res.accessToken))
    );
  }

  login(payload: any): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/login`, payload).pipe(
      tap(res => this.handleAuthSuccess(res.accessToken))
    );
  }

  fetchMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap(user => this.currentUser.set(user))
    );
  }

  logout() {
    this.currentUser.set(null);
    this.accessToken.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private handleAuthSuccess(token: string) {
    this.accessToken.set(token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }
}
