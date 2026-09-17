import { Injectable, signal, computed, inject } from '@angular/core';
import { Profile, CreateProfilePayload } from './models/profile.interface';
import { FamilyService } from './family.service';

@Injectable({
  providedIn: 'root'
})
export class FamilyStore {
  private familyService = inject(FamilyService);

  // --- STATE ---
  private _profiles = signal<Profile[]>([]);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  
  // --- SELECTORS (Computed) ---
  readonly profiles = computed(() => this._profiles());
  readonly isLoading = computed(() => this._isLoading());
  readonly error = computed(() => this._error());
  readonly totalProfiles = computed(() => this._profiles().length);

  // --- ACTIONS ---

  loadProfiles(): void {
    this._isLoading.set(true);
    this._error.set(null);
    
    this.familyService.getUserProfiles().subscribe({
      next: (data) => {
        this._profiles.set(data);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading profiles', err);
        this._error.set('No se pudieron cargar los perfiles familiares.');
        this._isLoading.set(false);
      }
    });
  }

  createProfile(payload: CreateProfilePayload, onSuccess?: () => void): void {
    this._isLoading.set(true);
    this.familyService.createProfile(payload).subscribe({
      next: (newProfile) => {
        // Actualizamos el estado local añadiendo el nuevo perfil
        this._profiles.update(profiles => [...profiles, newProfile]);
        this._isLoading.set(false);
        if (onSuccess) onSuccess();
      },
      error: (err) => {
        console.error('Error creating profile', err);
        this._error.set('No se pudo crear el perfil.');
        this._isLoading.set(false);
      }
    });
  }
}
