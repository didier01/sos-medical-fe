import { Component, signal, computed, output } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tyc-consent-modal',
  standalone: true,
  imports: [CommonModule, NzModalModule, NzCheckboxModule, NzButtonModule, NzAlertModule, FormsModule],
  templateUrl: './tyc-consent-modal.component.html',
  styleUrls: ['./tyc-consent-modal.component.scss']
})
export class TycConsentModalComponent {
  readonly isVisible = signal(true);
  readonly authHealthData = signal(false);
  readonly declareGuardianship = signal(false);
  readonly acceptTriageDisclaimer = signal(false);

  // Computed Signal: Validación estricta para habilitar botón
  readonly canProceed = computed(() => 
    this.authHealthData() && this.declareGuardianship() && this.acceptTriageDisclaimer()
  );

  readonly onConfirmed = output<{
    sensitiveData: boolean;
    guardianship: boolean;
    triageAccepted: boolean;
    version: string;
  }>();

  submitConsent(): void {
    if (this.canProceed()) {
      this.onConfirmed.emit({
        sensitiveData: this.authHealthData(),
        guardianship: this.declareGuardianship(),
        triageAccepted: this.acceptTriageDisclaimer(),
        version: 'v3.0-CO'
      });
      this.isVisible.set(false);
    }
  }
}
