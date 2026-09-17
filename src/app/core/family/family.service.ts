import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Profile, CreateProfilePayload } from './models/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/profiles`; // e.g., http://localhost:3000/api/v1/profiles

  // Get all profiles for the current user
  getUserProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(this.apiUrl);
  }

  // Create a new profile
  createProfile(payload: CreateProfilePayload): Observable<Profile> {
    return this.http.post<Profile>(this.apiUrl, payload);
  }

  // Update an existing profile
  updateProfile(id: string, payload: Partial<CreateProfilePayload>): Observable<Profile> {
    return this.http.put<Profile>(`${this.apiUrl}/${id}`, payload);
  }
}
