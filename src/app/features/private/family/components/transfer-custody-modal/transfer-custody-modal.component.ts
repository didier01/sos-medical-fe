import { Component, inject, input, output, signal } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transfer-custody-modal',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzAlertModule,
    ReactiveFormsModule
  ],
  templateUrl: './transfer-custody-modal.component.html',
  styleUrl: './transfer-custody-modal.component.scss'
})
export class TransferCustodyModalComponent {
  profileName = input.required<string>();
  onClose = output<void>();

  private fb = inject(FormBuilder);

  step = signal<number>(1);

  transferForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    confirmText: ['', [Validators.required, Validators.pattern('^TRANSFERIR$')]]
  });

  nextStep(): void {
    this.step.set(2);
  }

  prevStep(): void {
    this.step.set(1);
  }

  handleCancel(): void {
    this.onClose.emit();
  }

  handleOk(): void {
    if (this.transferForm.valid) {
      console.log('Iniciando traspaso para el perfil', this.profileName(), 'a:', this.transferForm.value.email);
      this.onClose.emit();
    }
  }
}
