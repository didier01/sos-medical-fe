import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { AuthStore } from '../../../../../core/auth/auth.store';

@Component({
  selector: 'app-medical-record-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzCollapseModule,
    NzDatePickerModule,
    NzSwitchModule,
    NzIconModule,
    NzTagModule
  ],
  templateUrl: './medical-record-editor.component.html',
  styleUrl: './medical-record-editor.component.scss'
})
export class MedicalRecordEditorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authStore = inject(AuthStore);
  private msg = inject(NzMessageService);

  isNewProfile = true;
  profileId: string | null = null;

  medicalForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    birthDate: [null, Validators.required],
    bloodType: [null, Validators.required],
    emergencyContact: this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\\+[1-9]\\d{1,14}$/)]], // E.164 validation
      hasWhatsapp: [true]
    }),
    allergies: [''],
    conditions: [''],
    insurance: ['', Validators.required],
    notes: ['']
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.profileId = params.get('id');
        this.isNewProfile = false;
        // Aquí se haría un GET al backend para popular el formulario
      }
    });
  }

  useMyDataAsContact() {
    const user = this.authStore.currentUser();
    if (user) {
      this.medicalForm.get('emergencyContact')?.patchValue({
        name: user.displayName || 'Tutor',
        // Mock phone as we don't have it in User model right now
        phone: '+573000000000' 
      });
      this.msg.success('Datos autocompletados correctamente');
    } else {
      this.msg.warning('No se encontraron los datos del usuario logueado');
    }
  }

  saveProfile() {
    if (this.medicalForm.valid) {
      this.msg.success('Perfil guardado exitosamente');
      this.router.navigate(['/dashboard/family']);
    }
  }

  goBack() {
    this.router.navigate(['/dashboard/family']);
  }
}
