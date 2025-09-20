import {NgModule} from '@angular/core';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutComponent} from './application/layout/layout.component';
import {HomeComponent} from './modules/home/home.component';
import {LoginComponent} from './security/login/login.component';
import {CallbackComponent} from './security/callback/callback.component';
import {NotFoundComponent} from './application/static/not-found/not-found.component';
import {AccessDeniedComponent} from './application/static/access-denied/access-denied.component';
import {HttpClient, provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";

import {definePreset} from "@primeng/themes";
import {registerLocaleData} from "@angular/common";

import localeEn from '@angular/common/locales/en';
import localePt from '@angular/common/locales/pt';
import localeFr from '@angular/common/locales/fr';

import Aura from "@primeng/themes/aura";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {LocaleProvider} from "./services/locale-app.service";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {providePrimeNG} from "primeng/config";
import {authInterceptor} from "./security/auth-interceptor";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {Button} from "primeng/button";
import {FileUpload} from "primeng/fileupload";
import { SelectButtonModule } from 'primeng/selectbutton';
import {FormsModule} from "@angular/forms";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

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

registerLocaleData(localeEn);
registerLocaleData(localePt);
registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HomeComponent,
    LoginComponent,
    CallbackComponent,
    NotFoundComponent,
    AccessDeniedComponent
  ],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserModule,
    AppRoutingModule,
    Button,
    FileUpload,
    SelectButtonModule,
    FormsModule
  ],
  providers: [
    LocaleProvider,
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    providePrimeNG({
      theme: {
        preset: CustomColors,
        options: {
          prefix: "p",
          darkModeSelector: "system",
          cssLayer: false,
        }
      }
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
