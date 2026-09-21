import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LocationPayload {
  latitude?: number;
  longitude?: number;
}

@Injectable({ providedIn: 'root' })
export class SosGatewayService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/sos`;

  // Estado con Signals
  readonly publicProfile = signal<any | null>(null);
  readonly unlockedContacts = signal<any[]>([]);
  readonly isLoading = signal<boolean>(false);

  loadPublicProfile(slug: string): Observable<any> {
    this.isLoading.set(true);
    return this.http.get<any>(`${this.apiUrl}/${slug}`).pipe(
      tap({
        next: (profile) => {
          this.publicProfile.set(profile);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      })
    );
  }

  triggerAlert(slug: string, location?: LocationPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/${slug}/trigger-alert`, location || {});
  }

  unlockPhones(slug: string, location?: LocationPayload): Observable<{ success: boolean; contacts: any[] }> {
    return this.http.post<{ success: boolean; contacts: any[] }>(`${this.apiUrl}/${slug}/unlock-phone`, location || {}).pipe(
      tap((res) => {
        if (res && res.success && res.contacts) {
          this.unlockedContacts.set(res.contacts);
        }
      })
    );
  }
}
