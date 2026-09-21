import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Profile, CreateProfilePayload } from './models/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/profiles`;

  // Estado con Signals
  readonly profiles = signal<Profile[]>([]);
  readonly activeProfile = signal<Profile | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * Carga los perfiles del hogar y actualiza el signal `profiles`.
   */
  loadUserProfiles(): Observable<Profile[]> {
    this.isLoading.set(true);
    this.error.set(null);
    return this.http.get<Profile[]>(this.apiUrl).pipe(
      tap({
        next: (data) => {
          this.profiles.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error cargando perfiles', err);
          this.error.set('No se pudieron cargar los perfiles.');
          this.isLoading.set(false);
        }
      })
    );
  }

  createProfile(payload: CreateProfilePayload): Observable<Profile> {
    return this.http.post<Profile>(this.apiUrl, payload);
  }

  updateProfile(id: string, payload: Partial<CreateProfilePayload>): Observable<Profile> {
    return this.http.put<Profile>(`${this.apiUrl}/${id}`, payload);
  }

  // --- NUEVOS ENDPOINTS (Basados en la guía de integración) ---

  /** 2. Estudio QR y NFC */
  downloadQrSvg(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/qr`, { responseType: 'blob' });
  }

  getNfcPayload(id: string): Observable<{ success: boolean; encoding: string; payload: string }> {
    return this.http.get<{ success: boolean; encoding: string; payload: string }>(`${this.apiUrl}/${id}/nfc-payload`);
  }

  /** 3. Kit Familiar PDF */
  downloadPdfKit(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf-kit`, { responseType: 'blob' });
  }

  /** 4. Traspaso de Custodia */
  transferOwnership(id: string, receiverEmail: string): Observable<{ message: string; token: string }> {
    return this.http.post<{ message: string; token: string }>(`${this.apiUrl}/${id}/transfer-ownership`, { receiverEmail });
  }

  acceptTransfer(token: string, keepAsCoAdmin: boolean): Observable<any> {
    // La guía ubica esto en /transfers, así que ajustamos la ruta
    return this.http.post(`${environment.apiUrl}/transfers/accept`, { token, keepAsCoAdmin });
  }

  /** 5. Invitar Co-Administrador */
  inviteMember(id: string, email: string, role: 'CO_ADMIN' | 'VIEWER'): Observable<{ message: string; memberId: string }> {
    return this.http.post<{ message: string; memberId: string }>(`${this.apiUrl}/${id}/members`, { email, role });
  }

  /** 6.2 Alertas Críticas Médicas (Records) */
  addMedicalRecord(id: string, payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/records`, payload);
  }

  /** 6.3 Directorio SOS Privado (Contactos) */
  addEmergencyContact(id: string, payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/emergency-contacts`, payload);
  }
}
