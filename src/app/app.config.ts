import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { MailOutline, LockOutline, EyeOutline, EyeInvisibleOutline, HeartOutline, GoogleOutline, SafetyCertificateOutline,
  PrinterFill, UserAddOutline, BgColorsOutline, TeamOutline, WarningFill, QrcodeOutline, MoreOutline, HeartFill, 
  AppstoreOutline, PrinterOutline, BellOutline, PlusOutline, ScissorOutline, DownloadOutline, UserOutline, FileTextOutline, EditOutline, ArrowLeftOutline,
  ScanOutline, WifiOutline, CheckCircleFill, ExportOutline, CloudOutline, DisconnectOutline
} from '@ant-design/icons-angular/icons';

const icons = [
  MailOutline, LockOutline, EyeOutline, EyeInvisibleOutline, HeartOutline, GoogleOutline, SafetyCertificateOutline,
  PrinterFill, UserAddOutline, BgColorsOutline, TeamOutline, WarningFill, QrcodeOutline, MoreOutline, HeartFill,
  AppstoreOutline, PrinterOutline, BellOutline, PlusOutline, ScissorOutline, DownloadOutline, UserOutline, FileTextOutline, EditOutline, ArrowLeftOutline,
  ScanOutline, WifiOutline, CheckCircleFill, ExportOutline, CloudOutline, DisconnectOutline
];

import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';

registerLocaleData(es);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideNzI18n(es_ES),
    provideNzIcons(icons)
  ]
};
