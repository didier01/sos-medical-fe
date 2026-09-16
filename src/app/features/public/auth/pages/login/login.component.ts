import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { AuthStore } from '../../../../../core/auth/auth.store';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { TycConsentModalComponent } from '../../components/tyc-consent-modal/tyc-consent-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    RouterLink,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzAvatarModule,
    NzIconModule,
    NzDividerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  showTycModal = signal(false);
  passwordVisible = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login attempt', this.loginForm.value);
      // Aquí irá la llamada al servicio de autenticación
    }
  }

  submitForm(): void {
    if (this.loginForm.valid) {
      // Mock para requerir TyC antes de completar el login
      this.showTycModal.set(true);
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  onTycConfirmed(consentData: any): void {
    // Aquí registraríamos el consentimiento y completaríamos el login
    this.authStore.loginMock(
      { id: '1', email: this.loginForm.value.email!, displayName: 'Tutor de Ejemplo' },
      'mock-jwt-token'
    );
    this.router.navigate(['/dashboard']);
  }
}
