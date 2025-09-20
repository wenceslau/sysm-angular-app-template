import {inject} from "@angular/core";
import {Router} from "@angular/router";
import {HttpAppService} from "./services/http-app.service";
import {LocaleAppService} from "./services/locale-app.service";
import {SignalAppService} from "./services/signal-app.service";
import {TranslateService} from "@ngx-translate/core";
import {TealiumAppService} from "./services/tealium-app.service";
import {DomSanitizer} from "@angular/platform-browser";

export class BaseComponent {

  protected readonly router = inject(Router);
  protected readonly httpApp = inject(HttpAppService);
  protected readonly localeApp = inject(LocaleAppService);
  protected readonly signalApp = inject(SignalAppService);
  protected readonly translate = inject(TranslateService);
  protected readonly tealium = inject(TealiumAppService);
  protected readonly sanitizer = inject(DomSanitizer);

  constructor() {
  }

  label(label: string) {
    return this.translate.instant(label);
  }

  loading(loading: boolean) {
    this.signalApp.loading.set(loading);
  }

  message(severity: string, content: string) {
    this.signalApp.message.set({severity, content});
  }
}
