import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {definePreset} from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {providePrimeNG} from 'primeng/config';
import {provideTranslateService} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import {authInterceptor} from './security/auth-interceptor';
import { LayoutComponent } from './application/layout/layout.component';
import { NotFoundComponent } from './application/pages/not-found/not-found.component';
import { AccessDeniedComponent } from './application/pages/access-denied/access-denied.component';
import { CallbackComponent } from './security/callback/callback.component';
const CustomColors = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fdfbf6',
      100: '#f6f2e2',
      200: '#e9dfb1',
      300: '#cebe8a',
      400: '#b29d64',
      500: '#957C3D',
      600: '#806a34',
      700: '#6b582b',
      800: '#564622',
      900: '#413519',
      950: '#2c2310'
    }
  }
});

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    NotFoundComponent,
    AccessDeniedComponent,
    CallbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    providePrimeNG({
      theme: {
        preset: CustomColors,
        options: {darkModeSelector: '.p-dark'},
      }
    }),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './i18n/',
        suffix: '.json'
      })
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
