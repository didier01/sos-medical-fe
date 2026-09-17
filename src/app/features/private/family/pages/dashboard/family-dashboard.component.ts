import { Component, signal } from '@angular/core';
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

interface FamilyProfile {
  id: string;
  name: string;
  role: 'Titular' | 'Hijo/a' | 'Adulto Mayor';
  avatarUrl?: string;
  coManaged?: boolean;
}

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
export class FamilyDashboardComponent {
  // Mock data
  profiles = signal<FamilyProfile[]>([
    { id: '1', name: 'Tutor Principal', role: 'Titular' },
    { id: '2', name: 'Hijo Menor', role: 'Hijo/a', coManaged: true },
    { id: '3', name: 'Abuelo', role: 'Adulto Mayor' }
  ]);

  selectedProfile = signal<FamilyProfile | null>(null);
  transferProfile = signal<FamilyProfile | null>(null);

  constructor(private router: Router) {}

  getBadgeStatus(role: string): 'success' | 'processing' | 'default' | 'error' | 'warning' {
    switch(role) {
      case 'Titular': return 'processing';
      case 'Hijo/a': return 'success';
      case 'Adulto Mayor': return 'warning';
      default: return 'default';
    }
  }

  createNewProfile() {
    this.router.navigate(['/dashboard/family/editor/new']);
  }

  editProfile(id: string) {
    this.router.navigate(['/dashboard/family/editor', id]);
  }

  openShareModal(profile: FamilyProfile) {
    this.selectedProfile.set(profile);
  }

  closeShareModal() {
    this.selectedProfile.set(null);
  }

  openTransferModal(profile: FamilyProfile) {
    this.transferProfile.set(profile);
  }

  closeTransferModal() {
    this.transferProfile.set(null);
  }
}
