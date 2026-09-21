import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShareProfileModalComponent } from '../../components/share-profile-modal/share-profile-modal.component';
import { TransferCustodyModalComponent } from '../../components/transfer-custody-modal/transfer-custody-modal.component';
import { FamilyService } from '../../../../../core/family/family.service';
import { Profile } from '../../../../../core/family/models/profile.interface';

@Component({
  selector: 'app-family-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzAvatarModule,
    NzBadgeModule,
    NzTagModule,
    NzButtonModule,
    NzGridModule,
    NzIconModule,
    NzDropDownModule,
    ShareProfileModalComponent,
    TransferCustodyModalComponent,
    RouterModule
  ],
  templateUrl: './family-dashboard.component.html',
  styleUrl: './family-dashboard.component.scss'
})
export class FamilyDashboardComponent implements OnInit {
  private familyService = inject(FamilyService);
  private router = inject(Router);

  profiles = computed(() => this.familyService.profiles());
  isLoading = computed(() => this.familyService.isLoading());

  selectedProfile = signal<Profile | null>(null);
  transferProfile = signal<Profile | null>(null);

  ngOnInit() {
    this.familyService.loadUserProfiles().subscribe();
  }

  getBadgeStatus(role?: string): 'success' | 'processing' | 'default' | 'error' | 'warning' {
    switch(role) {
      case 'OWNER': return 'processing';
      case 'CO_ADMIN': return 'success';
      case 'VIEWER': return 'warning';
      default: return 'default';
    }
  }

  getRoleLabel(role?: string): string {
    switch(role) {
      case 'OWNER': return 'Titular';
      case 'CO_ADMIN': return 'Co-Admin';
      case 'VIEWER': return 'Lector';
      default: return 'Desconocido';
    }
  }

  createNewProfile() {
    this.router.navigate(['/dashboard/family/editor/new']);
  }

  editProfile(id: string) {
    this.router.navigate(['/dashboard/family/editor', id]);
  }

  openShareModal(profile: Profile) {
    this.selectedProfile.set(profile);
  }

  closeShareModal() {
    this.selectedProfile.set(null);
  }

  openTransferModal(profile: Profile) {
    this.transferProfile.set(profile);
  }

  closeTransferModal() {
    this.transferProfile.set(null);
  }
}
