import { Component, inject, input, output } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-share-profile-modal',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzRadioModule,
    ReactiveFormsModule
  ],
  templateUrl: './share-profile-modal.component.html',
  styleUrl: './share-profile-modal.component.scss'
})
export class ShareProfileModalComponent {
  profileName = input.required<string>();
  onClose = output<void>();

  private fb = inject(FormBuilder);

  shareForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['CO_ADMIN', Validators.required]
  });

  handleCancel(): void {
    this.onClose.emit();
  }

  handleOk(): void {
    if (this.shareForm.valid) {
      console.log('Enviando invitación a:', this.shareForm.value);
      this.onClose.emit();
    }
  }
}
