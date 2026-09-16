import { Routes } from '@angular/router';
import { PrivateLayoutComponent } from './layout/private-layout.component';
import { inject } from '@angular/core';
import { AuthStore } from '../../core/auth/auth.store';
import { Router } from '@angular/router';

// Guard simple en línea para proteger el dashboard
const authGuard = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  
  if (authStore.isAuthenticated()) {
    return true;
  }
  
  // Para pruebas en Fase 2 (mock), comentamos la redirección forzosa, pero este es el lugar:
  // router.navigate(['/auth/login']);
  // return false;
  return true; // Permitir acceso temporal para ver el diseño
};

export const privateRoutes: Routes = [
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'family', pathMatch: 'full' },
      {
        path: 'family',
        loadComponent: () => import('./family/pages/dashboard/family-dashboard.component').then(m => m.FamilyDashboardComponent)
      },
      {
        path: 'family/kit',
        loadComponent: () => import('./family/pages/kit/family-kit.component').then(m => m.FamilyKitComponent)
      },
      {
        path: 'family/studio',
        loadComponent: () => import('./family/pages/studio/qr-studio.component').then(m => m.QrStudioComponent)
      },
      {
        path: 'family/editor/:id',
        loadComponent: () => import('./family/pages/editor/medical-record-editor.component').then(m => m.MedicalRecordEditorComponent)
      },
      {
        path: 'family/editor/new',
        loadComponent: () => import('./family/pages/editor/medical-record-editor.component').then(m => m.MedicalRecordEditorComponent)
      }
    ]
  }
];
