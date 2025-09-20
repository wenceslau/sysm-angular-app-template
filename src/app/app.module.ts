import {NgModule} from '@angular/core';
import {providePrimeNG} from 'primeng/config';
import {definePreset} from '@primeuix/themes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {provideTranslateService, TranslatePipe} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import {authInterceptor} from './security/auth-interceptor';
import {registerLocaleData} from "@angular/common";



import {AppRoutingModule} from './app-routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from "@angular/forms";

import {AppComponent} from './app.component';
import {LayoutComponent} from './application/layout/layout.component';
import {NotFoundComponent} from './application/static/not-found/not-found.component';
import {AccessDeniedComponent} from './application/static/access-denied/access-denied.component';
import {CallbackComponent} from './security/callback/callback.component';
import {LoginComponent} from './security/login/login.component';
import {HomeComponent} from './modules/home/home.component';

import {LocaleProvider} from './services/locale-app.service';
import Aura from '@primeuix/themes/aura';

import {Button} from "primeng/button";
import {FileUpload} from "primeng/fileupload";
import {SelectButtonModule} from 'primeng/selectbutton';

import localeEn from '@angular/common/locales/en';
import localePt from '@angular/common/locales/pt';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeEn);
registerLocaleData(localePt);
registerLocaleData(localeFr);

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
    CallbackComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TranslatePipe,
    Button,
    FileUpload,
    SelectButtonModule,
    FormsModule
  ],
  providers: [
    LocaleProvider,
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
