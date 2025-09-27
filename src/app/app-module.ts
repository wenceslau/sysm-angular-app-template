import {NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from "@angular/core";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "./security/auth-interceptor";
import {providePrimeNG} from "primeng/config";
import {provideTranslateService} from "@ngx-translate/core";
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import {registerLocaleData} from "@angular/common";
import {definePreset} from "@primeuix/themes";

import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "./app-routing-module";
import {App} from "./app";
import {Home} from "./modules/home/home";
import {Sample} from "./modules/sample/sample";
import {Callback} from "./security/callback/callback";
import {Login} from "./security/login/login";
import {Layout} from "./application/layout/layout";
import {NotFound} from "./application/static/not-found/not-found";
import {AppError} from "./application/static/app-error/app-error";
import {Unauthorized} from "./application/static/unauthorized/unauthorized";

import localeEn from "@angular/common/locales/en";
import localePt from "@angular/common/locales/pt";
import localeFr from "@angular/common/locales/fr";

import Aura from "@primeuix/themes/aura";
import {LocaleProvider} from "./services/locale-app";

registerLocaleData(localeEn);
registerLocaleData(localePt);
registerLocaleData(localeFr);

const CustomColors = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#fdfbf6",
      100: "#f6f2e2",
      200: "#e9dfb1",
      300: "#cebe8a",
      400: "#b29d64",
      500: "#957C3D",
      600: "#806a34",
      700: "#6b582b",
      800: "#564622",
      900: "#413519",
      950: "#2c2310"
    }
  }
});

@NgModule({
  declarations: [
    App,
    Home,
    Sample,
    Callback,
    Login,
    Layout,
    NotFound,
    AppError,
    Unauthorized
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    LocaleProvider,
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    providePrimeNG({
      theme: {
        preset: CustomColors,
        options: {darkModeSelector: ".p-dark"},
      }
    }),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: "./i18n/",
        suffix: ".json"
      })
    })
  ],
  bootstrap: [App]
})
export class AppModule {
}
