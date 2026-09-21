import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { NzDividerModule } from 'ng-zorro-antd/divider';

import { AuthService } from '../../../../../core/auth/auth.service';
import { FamilyService } from '../../../../../core/family/family.service';

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
    NzTagModule,
    NzDividerModule
  ],
  templateUrl: './medical-record-editor.component.html',
  styleUrl: './medical-record-editor.component.scss'
})
export class MedicalRecordEditorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private msg = inject(NzMessageService);
  private familyService = inject(FamilyService);

  isNewProfile = true;
  profileId: string | null = null;

  medicalProfileForm: FormGroup = this.fb.group({
    profile: this.fb.group({
      aliasName: ['', Validators.required],
      fullNamePrivate: ['', Validators.required],
      birthDate: [null, Validators.required],
      bloodType: [null, Validators.required],
      photoUrl: ['']
    }),
    emergencyContacts: this.fb.array([]),
    allergies: this.fb.array([]),
    conditions: this.fb.array([]),
    medications: this.fb.array([]),
    insurance: this.fb.group({
      title: ['', Validators.required],
      policyNumber: [''],
      assistancePhone: ['']
    }),
    notes: ['']
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.profileId = params.get('id');
        this.isNewProfile = false;
        // Aquí se haría un GET al backend para popular el formulario
      } else {
        // Inicializar con un contacto vacío por defecto si es nuevo
        this.addEmergencyContact();
      }
    });
  }

  // --- Getters para FormArrays ---
  get emergencyContacts(): FormArray {
    return this.medicalProfileForm.get('emergencyContacts') as FormArray;
  }

  get allergies(): FormArray {
    return this.medicalProfileForm.get('allergies') as FormArray;
  }

  get conditions(): FormArray {
    return this.medicalProfileForm.get('conditions') as FormArray;
  }

  get medications(): FormArray {
    return this.medicalProfileForm.get('medications') as FormArray;
  }

  // --- Métodos para Contactos de Emergencia ---
  createEmergencyContact(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      relationship: ['', Validators.required],
      countryCode: ['+57', Validators.required], // Mantenemos selector
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      isWhatsapp: [true]
    });
  }

  addEmergencyContact() {
    this.emergencyContacts.push(this.createEmergencyContact());
  }

  removeEmergencyContact(index: number) {
    if (this.emergencyContacts.length > 1) {
      this.emergencyContacts.removeAt(index);
    } else {
      this.msg.warning('Debe haber al menos un contacto de emergencia.');
    }
  }

  // --- Métodos Genéricos para Arrays de Salud ---
  createMedicalRecordItem(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required]
    });
  }

  addAllergy() { this.allergies.push(this.createMedicalRecordItem()); }
  removeAllergy(i: number) { this.allergies.removeAt(i); }

  addCondition() { this.conditions.push(this.createMedicalRecordItem()); }
  removeCondition(i: number) { this.conditions.removeAt(i); }

  addMedication() { this.medications.push(this.createMedicalRecordItem()); }
  removeMedication(i: number) { this.medications.removeAt(i); }

  // --- Utilidad ---
  useMyDataAsContact(index: number) {
    const user = this.authService.currentUser();
    if (user) {
      this.emergencyContacts.at(index).patchValue({
        name: user.displayName || 'Tutor',
        relationship: 'Familiar',
        countryCode: '+57',
        phone: '3000000000'
      });
      this.msg.success('Datos autocompletados correctamente');
    } else {
      this.msg.warning('No se encontraron los datos del usuario logueado');
    }
  }

  // --- Submit y Transformación ---
  onSubmit() {
    if (this.medicalProfileForm.invalid) {
      this.msg.error('Por favor revise los campos del formulario.');
      // Marcar todo como tocado para mostrar errores
      Object.values(this.medicalProfileForm.controls).forEach(control => {
        if (control instanceof FormGroup || control instanceof FormArray) {
          control.markAllAsTouched();
        } else {
          control.markAsTouched();
        }
      });
      return;
    }

    const rawData = this.medicalProfileForm.value;
    
    // Procesar contactos (combinar countryCode y phone en phoneE164)
    const processedContacts = rawData.emergencyContacts.map((contact: any) => {
      return {
        name: contact.name,
        relationship: contact.relationship,
        phoneE164: `${contact.countryCode}${contact.phone}`,
        isWhatsapp: contact.isWhatsapp
      };
    });

    // Consolidar Medical Records
    const medicalRecords: any[] = [];
    
    rawData.allergies.forEach((a: any) => {
      medicalRecords.push({ category: 'ALLERGY', title: a.title });
    });
    
    rawData.conditions.forEach((c: any) => {
      medicalRecords.push({ category: 'CONDITION', title: c.title });
    });
    
    rawData.medications.forEach((m: any) => {
      medicalRecords.push({ category: 'MEDICATION', title: m.title });
    });

    // Agregar seguro como medical record si tiene título
    if (rawData.insurance.title) {
      medicalRecords.push({
        category: 'INSURANCE',
        title: rawData.insurance.title,
        policyNumber: rawData.insurance.policyNumber,
        assistancePhone: rawData.insurance.assistancePhone
      });
    }

    // Objeto Final a enviar
    const payload = {
      ...rawData.profile,
      emergencyContacts: processedContacts,
      medicalRecords: medicalRecords,
      notes: rawData.notes
    };

    console.log('Payload final consolidado:', payload);
    
    this.familyService.createProfile(payload).subscribe({
      next: (res) => {
        this.msg.success('Perfil guardado exitosamente');
        this.router.navigate(['/dashboard/family']);
      },
      error: (err) => {
        console.error('Error al guardar el perfil:', err);
        this.msg.error('Hubo un error al intentar guardar el perfil.');
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard/family']);
  }
}
