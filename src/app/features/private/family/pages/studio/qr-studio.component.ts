import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-qr-studio',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule, RouterModule],
  templateUrl: './qr-studio.component.html',
  styleUrl: './qr-studio.component.scss'
})
export class QrStudioComponent {}
