import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ConsentPayload {
  tycVersion: string;
  sensitiveDataAuthorized: boolean;
  guardianshipDeclared: boolean;
}

@Injectable({ providedIn: 'root' })
export class LegalService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/legal`;

  acceptConsent(payload: ConsentPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/consent`, payload);
  }
}
