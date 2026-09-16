import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Allergy {
  name: string;
  severity: 'mortal' | 'moderada';
}

interface KitProfile {
  id: string;
  name: string;
  ageText: string;
  bloodType: string;
  epsName: string;
  epsPhone: string;
  conditions: string;
  allergies: Allergy[];
  avatarUrl?: string;
  gender: 'M' | 'F';
}

@Component({
  selector: 'app-family-kit',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzAvatarModule,
    NzRadioModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './family-kit.component.html',
  styleUrl: './family-kit.component.scss'
})
export class FamilyKitComponent {
  paperSize = signal<'carta' | 'a4'>('carta');

  // Mock data basado en el diseño
  profiles = signal<KitProfile[]>([
    {
      id: '1',
      name: 'Mateo',
      ageText: '10 años y 4 meses',
      bloodType: 'O+',
      epsName: 'SURA',
      epsPhone: 'PL-908 442 771',
      conditions: 'Asma · Espectro autista',
      allergies: [
        { name: 'Penicilina', severity: 'mortal' },
        { name: 'Maní', severity: 'moderada' }
      ],
      gender: 'M'
    },
    {
      id: '2',
      name: 'Juanita',
      ageText: '14 años',
      bloodType: 'A-',
      epsName: 'Nueva EPS',
      epsPhone: 'PL-441 220 013',
      conditions: 'Diabetes',
      allergies: [
        { name: 'Picadura de abeja', severity: 'mortal' }
      ],
      gender: 'F'
    },
    {
      id: '3',
      name: 'Abuela Carmen',
      ageText: '78 años',
      bloodType: 'B+',
      epsName: 'Sanitas',
      epsPhone: 'PL-772 100 908',
      conditions: 'Hipertensión · Marcapasos',
      allergies: [
        { name: 'Sulfas', severity: 'moderada' }
      ],
      gender: 'F'
    }
  ]);

  printKit() {
    window.print();
  }

  downloadPdf() {
    // Por ahora, reutilizamos la impresión nativa (los navegadores permiten guardar como PDF desde ahí)
    // En el futuro, podríamos integrar librerías como jsPDF o llamar a un backend que genere el PDF.
    this.printKit();
  }
}
