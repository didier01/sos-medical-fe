# Plan de Desarrollo Frontend: Plataforma de Emergencia Médica & Códigos QR

> **Entorno:** Frontend Web (PWA & Mobile-First)  
> **Stack Técnico:** Angular 21 (Standalone Components, Signals Reactivas, SSR / Prerendering, Zoneless Change Detection).  
> **UI Kit & Estilos:** **NG-ZORRO (`ng-zorro-antd`)** + SCSS Personalizado (Diseño Hospitalario y Triage Clínico). **Sin Tailwind CSS**.  
> **Enfoque:** Alta reactividad con Signals, Vista Pública SOS Ultraligera (< 800 ms), Modelo de Contacto Escalonado, WebNFC API y Cumplimiento Legal Habeas Data.

---

## 1. Arquitectura del Frontend y Principios de Diseño

```
                               ┌────────────────────────────────────────┐
                               │           ANGULAR 21 APP ROOT          │
                               │   (Standalone, Zoneless, Signals)      │
                               └──────────────────┬─────────────────────┘
                                                  │
         ┌──────────────────┬─────────────────────┼─────────────────────┬──────────────────┐
         ▼                  ▼                     ▼                     ▼                  ▼
  ┌──────────────┐   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐   ┌──────────────┐
  │ CoreModule / │   │ AuthFeature  │      │FamilyFeature │      │PublicSosView │   │  NfcFeature  │
  │ Providers    │   │ (Login/TyC)  │      │(Dashboard/QR)│      │ (/sos/:slug) │   │ (WebNFC Tool)│
  └──────┬───────┘   └──────┬───────┘      └──────┬───────┘      └──────┬───────┘   └──────┬───────┘
         │                  │                     │                     │                  │
         ▼                  ▼                     ▼                     ▼                  ▼
  ┌──────────────┐   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐   ┌──────────────┐
  │ Interceptors │   │ AuthState    │      │ ProfileState │      │ SosEdgeState │   │ NDEFReader   │
  │ (JWT/Http)   │   │  (Signals)   │      │  (Signals)   │      │  (Signals)   │   │  (Hardware)  │
  └──────────────┘   └──────────────┘      └──────────────┘      └──────────────┘   └──────────────┘
```

### Principios Fundamentales:
1. **Gestión de Estado Basada Exclusivamente en Signals:** Eliminación de boilerplate complejo. Se utilizan `signal()`, `computed()` y `effect()` para el estado local y global (`SignalStore` liviano).
2. **Cero Tailwind — Diseño Integral con NG-ZORRO:** Uso de componentes nativos de `ng-zorro-antd` (`NzCardModule`, `NzFormModule`, `NzButtonModule`, `NzModalModule`, `NzAlertModule`, `NzTagModule`, `NzAvatarModule`, etc.) adaptados con temas SCSS para entornos clínicos y de alta legibilidad.
3. **Aislamiento Ultraligero de la Vista Pública (`/sos/:slug`):**  
   Para cumplir con el RNF-01 (< 800 ms y < 100 KB de carga útil), la ruta `/sos/:slug` no carga módulos pesados del dashboard administrativo. Se pre-renderiza mediante SSR con hidratación selectiva y estilos críticos inline.
4. **Respeto Estricto de Consentimiento Legal:** Bloqueo de creación de perfiles hasta que se firme electrónicamente el modal de Habeas Data y Patria Potestad.

---

## 2. Marco Legal, Disclaimers y Componente de Términos (TyC)

### Componente: `TycConsentModalComponent`
Modal bloqueante implementado con `nz-modal` que aparece en el primer inicio de sesión o al crear un nuevo perfil médico:

```typescript
// tyc-consent-modal.component.ts
import { Component, signal, computed, output } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tyc-consent-modal',
  standalone: true,
  imports: [NzModalModule, NzCheckboxModule, NzButtonModule, NzAlertModule, FormsModule],
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
```

```html
<!-- tyc-consent-modal.component.html -->
<nz-modal
  [nzVisible]="isVisible()"
  nzTitle="Consentimiento Informado & Declaración Legal (Ley 1581 de 2012)"
  [nzClosable]="false"
  [nzMaskClosable]="false"
  [nzFooter]="modalFooter"
>
  <ng-container *nzModalContent>
    <nz-alert
      nzType="warning"
      nzMessage="Tratamiento de Datos Sensibles de Salud"
      nzDescription="En cumplimiento de la legislación colombiana y latinoamericana, el registro de información médica vinculada a identificadores de emergencia requiere su autorización explícita."
      nzShowIcon
      class="mb-3"
    ></nz-alert>

    <div class="consent-checks">
      <label nz-checkbox [ngModel]="authHealthData()" (ngModelChange)="authHealthData.set($event)">
        <strong>1. Autorización de Datos de Salud (Ley 1581/2012):</strong> Autorizo el tratamiento de mis datos de salud (grupo sanguíneo, alergias, diagnósticos y EPS) con el fin exclusivo de permitir la consulta médica inmediata ante una emergencia vital.
      </label>

      <label nz-checkbox [ngModel]="declareGuardianship()" (ngModelChange)="declareGuardianship.set($event)">
        <strong>2. Representación Legal y Menores de Edad:</strong> Declaro bajo gravedad de juramento que ostento la patria potestad o custodia formal sobre los menores de edad o dependientes registrados, actuando en garantía de su interés superior.
      </label>

      <label nz-checkbox [ngModel]="acceptTriageDisclaimer()" (ngModelChange)="acceptTriageDisclaimer.set($event)">
        <strong>3. Deslinde de Responsabilidad Médica:</strong> Comprendo que este sistema es una herramienta de orientación referencial y NO constituye un dispositivo médico certificado (no es SaMD). El personal de socorro aplicará protocolos clínicos internacionales (PHTLS/ATLS).
      </label>
    </div>
  </ng-container>

  <ng-template #modalFooter>
    <button nz-button nzType="primary" [disabled]="!canProceed()" (click)="submitConsent()">
      Aceptar y Continuar
    </button>
  </ng-template>
</nz-modal>
```

---

## 3. Desglose Funcional de Módulos y Pantallas en Angular 21

### Módulo 1: Autenticación, Sesión y Guards (RF-01)
* **Componentes:**
  * `LoginComponent` y `RegisterComponent` estructurados con `nz-form`, `nz-input` y validadores reactivos.
  * Botón oficial de Google Sign-In integrado con `@angular/google-tag-manager` o SDK de Google Identity Services.
* **Manejo de Estado con Signals (`AuthStore`):**
  ```typescript
  @Injectable({ providedIn: 'root' })
  export class AuthStore {
    readonly currentUser = signal<User | null>(null);
    readonly isAuthenticated = computed(() => !!this.currentUser());
    readonly accessToken = signal<string | null>(null);
  }
  ```
* **Interceptor HTTP:** Intercepta peticiones para inyectar `Bearer ${accessToken}` y renueva tokens automáticamente ante respuestas 401 usando `HttpHandlerFn`.

### Módulo 2: Dashboard Familiar Multi-Perfil (RF-02, RF-03, RF-05)
* **Componente `FamilyDashboardComponent`:**
  * Maquetación en cuadrícula de tarjetas con `nz-row` y `nz-col`.
  * Cada tarjeta (`nz-card`) representa un perfil familiar con:
    * Avatar con foto del familiar (`nz-avatar`).
    * Badge de rol: `Titular` (Azul), `Hijo/a` (Verde), `Adulto Mayor` (Púrpura) con `nz-badge`.
    * Indicador de Co-gestión: Etiqueta `Co-Administrado por 2 tutores` con `nz-tag`.
    * Accesos directos: *Editar Ficha*, *Ver QR*, *Transferir Custodia*.
* **Auto-asignación Rápida (RF-05):**
  * Botón interactivo: `[nz-button] "Usar mis datos como contacto SOS"` que lee el `currentUser()` desde el `AuthStore` y autocompleta el formulario reactivo del familiar con un solo clic.
* **Modal de Co-Gestión Familiar (RF-03):**
  * `ShareProfileModalComponent`: Permite invitar a otro padre o cuidador ingresando su correo y seleccionando rol (`Co-Administrador` o `Lector`) usando `nz-select`.

### Módulo 3: Formulario Clínico y Ficha Médica Estructurada (RF-06, RF-07, RF-08, RF-09)
* **Componente `MedicalRecordEditorComponent`:**
  * **Paso 1: Biometría:** Selector estricto de grupo sanguíneo con `nz-select` (`A+`, `A-`, `O+`, etc.), foto de perfil con componente `nz-upload`, fecha de nacimiento con cálculo reactivo de edad (`computed(() => calculateAge(birthDate()))`).
  * **Paso 2: Directorio SOS Privado:** Hasta 3 contactos con validación visual de formato internacional E.164 (ej. `+57 300 123 4567`) y switch `nz-switch` para *"Dispone de WhatsApp"*.
  * **Paso 3: Alertas Críticas (4 bloques con `nz-collapse`):**
    * *Alergias severas:* Tags dinámicos con `nz-tag` y selector de severidad (`LEVE`, `MODERADA`, `CRÍTICA`).
    * *Condiciones preexistentes:* Asma, diabetes, epilepsia, marcapasos.
    * *Medicamentos actuales:* Nombre comercial, principio activo y dosificación.
    * *Seguridad Social & EPS:* Nombre de la EPS/Seguro, número de póliza y teléfono de asistencia médica (ej. `#888`).
  * **Paso 4: Instrucciones Especiales:** Área de texto enriquecida para notas operativas (*"Inhalador en el bolsillo frontal del morral escolar"*).

### Módulo 4: Protocolo de Traspaso de Custodia (RF-04)
* **Componentes:**
  * `InitiateTransferModalComponent`: El titular actual ingresa el correo del nuevo tutor y confirma mediante advertencia de confirmación (`nz-popconfirm`).
  * `AcceptTransferViewComponent` (Ruta `/transfers/accept?token=...`):
    * Lee el token criptográfico de la URL.
    * Muestra un resumen de la ficha a transferir y botón de aceptación bilateral: *"Aceptar Custodia Definitiva del Perfil"*.
    * Al confirmar, se actualizan los permisos sin alterar los códigos QR físicos existentes.

### Módulo 5: Vista Pública SOS Ultraligera & Mecanismo Escalonado (RF-10, RF-11, RF-12)
* **Ruta Pública (`/sos/:slug`):**
  * Optimizada para **Server-Side Rendering (SSR)**.
  * Cero estilos innecesarios; paleta de alto contraste para visibilidad bajo luz solar directa o lluvia:
    * **Grupo Sanguíneo Gigante:** Tarjeta de fondo blanco con tipografía roja médica `#DC2626` de 36px y factor RH destacado.
    * **Alergias Críticas:** Bloque de alerta superior `nz-alert nzType="error"` con ícono de peligro.
    * **EPS y Póliza de Seguro:** Datos claros para agilizar el ingreso hospitalario en ambulancia.

* **Capa 1: Botón 1-Clic "Notificar a Familiares" (Opción B):**
  * Botón principal de llamada a la acción con animación pulsante.
  * Al hacer clic:
    1. Ejecuta en segundo plano `navigator.geolocation.getCurrentPosition()` con timeout de 2.5 segundos (no bloqueante).
    2. Envía la solicitud POST al backend con o sin coordenadas.
    3. Muestra feedback visual inmediato: `nz-message nzType="success"` *"Familiares notificados con tu ubicación actual"*.

* **Capa 2: Slider Interactivo de Desbloqueo Médico (Opción C / Nivel 2):**
  * Componente personalizado `EmergencySliderComponent`:
    * Control táctil deslizante que requiere deslizar una barra de izquierda a derecha con confirmación háptica (`navigator.vibrate([40, 60, 40])`).
    * Texto visible: *"Deslizar para llamar a familiar (Solo emergencia médica)"*.
    * Al completarse el recorrido:
      1. El cliente solicita la exposición del número al backend.
      2. El botón se transforma en un enlace directo de llamada: `<a href="tel:+57300..." nz-button nzType="primary" nzDanger nzBlock nzSize="large"><i nz-icon nzType="phone"></i> LLAMAR A MAMÁ (+57 300...)</a>`.

### Módulo 6: Generador QR, Impresión de Kit PDF y WebNFC (RF-13, RF-14, RF-15, RF-16)
* **Visualizador y Exportador de QR (RF-14):**
  * Renderizado del código QR vectorial en pantalla.
  * Botones de descarga instantánea con `nz-button`:
    * *Descargar PNG* (resolución 1024x1024 para fondos de pantalla).
    * *Descargar SVG* (vectorial infinito para serigrafía o imprenta de stickers en cascos).
* **Kit Familiar de Carnés PDF (RF-15):**
  * Componente `FamilyKitPreviewComponent`: Vista previa maquetada de la hoja de carnés con botón que invoca el endpoint de NestJS para descargar el archivo PDF listo para imprimir y laminar.
* **Grabador Físico NFC con WebNFC (RF-16):**
  * Servicio `NfcWriterService`:
    ```typescript
    @Injectable({ providedIn: 'root' })
    export class NfcWriterService {
      readonly isSupported = signal('NDEFReader' in window);

      async writeDualEmergencyTag(publicUrl: string, offlineSummary: string): Promise<void> {
        if (!this.isSupported()) {
          throw new Error('WebNFC no está soportado en este navegador (requiere Chrome en Android).');
        }
        const ndef = new (window as any).NDEFReader();
        await ndef.write({
          records: [
            { recordType: 'url', data: publicUrl },
            { recordType: 'text', data: offlineSummary }
          ]
        });
      }
    }
    ```

---

## 4. Matriz de Fases y Sprints de Desarrollo (Frontend)

| Sprint | Hitos Técnicos | Entregables Frontend (Angular 21 + NG-ZORRO) |
| :--- | :--- | :--- |
| **Sprint 1 (Sem 1-2)** | **Setup, Layout NG-ZORRO & TyC Legal** | • Configuración inicial Angular 21 con NG-ZORRO y SCSS modular.<br>• Implementación de `TycConsentModalComponent` (Ley 1581).<br>• Páginas de Login, Registro y Google OAuth con Forms reactivos.<br>• `AuthStore` con Signals e interceptor HTTP funcional. |
| **Sprint 2 (Sem 3-4)** | **Dashboard Familiar & Editor Clínico** | • `FamilyDashboardComponent` con tarjetas de perfiles y badges.<br>• `MedicalRecordEditorComponent` con formularios reactivos y validación E.164.<br>• Botón de auto-asignación rápida del titular (RF-05).<br>• Modal de invitación a co-administradores y pantalla de traspasos. |
| **Sprint 3 (Sem 5-6)** | **Vista Pública SOS & Slider Defensivo** | • Vista `/sos/:slug` pre-renderizada (SSR) ultraligera (< 800 ms).<br>• Botón 1-Clic de notificación con geolocalización asíncrona.<br>• Componente táctil interactivo `EmergencySliderComponent` con vibración.<br>• Bloques de alerta de alto contraste para alergias y grupo sanguíneo. |
| **Sprint 4 (Sem 7-8)** | **Kit PDF, WebNFC & Optimización PWA** | • Componente de vista previa y descarga del Kit Familiar en PDF.<br>• Integración de WebNFC API para grabación de chips NTAG215/216.<br>• Exportador de códigos QR vectoriales (SVG y PNG).<br>• Auditoría Lighthouse (Score 95+ en Performance y Accesibilidad). |

---

## 5. Estrategia de Estilos con NG-ZORRO & SCSS (Sin Tailwind)

El proyecto utiliza variables de tema de NG-ZORRO y estilos SCSS modulares para garantizar una experiencia visual clara, profesional y clínica:

```scss
// src/styles/theme-overrides.scss
// Modificaciones de variables de Ant Design para entorno de emergencias médicas

$primary-color: #0284c7; // Azul médico hospitalario
$error-color: #dc2626;   // Rojo alerta clínica (RH y Alergias severas)
$warning-color: #d97706; // Ámbar de advertencia farmacológica
$success-color: #16a34a; // Verde de confirmación de despacho SOS
$text-color: #0f172a;    // Contraste óptico alto para lectura en sol
$border-radius-base: 8px;

// Vista SOS Ultraligera (Estilos críticos)
.sos-public-container {
  max-width: 480px;
  margin: 0 auto;
  padding: 1rem;
  background-color: #f8fafc;
  min-height: 100vh;

  .blood-badge-card {
    text-align: center;
    background: #ffffff;
    border: 2px solid $error-color;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.25rem;

    .blood-group-text {
      font-size: 2.75rem;
      font-weight: 900;
      color: $error-color;
      line-height: 1;
    }
  }
}
```
