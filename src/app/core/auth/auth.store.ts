import { Injectable, computed, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly accessToken = signal<string | null>(null);

  // Mock methods for Phase 1
  loginMock(user: User, token: string) {
    this.currentUser.set(user);
    this.accessToken.set(token);
  }

  logout() {
    this.currentUser.set(null);
    this.accessToken.set(null);
  }
}
