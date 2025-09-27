import {inject} from "@angular/core";
import {Router} from "@angular/router";
import {HttpApp} from "./services/http-app";
import {LocaleApp} from "./services/locale-app";
import {SignalApp} from "./services/signal-app";
import {TranslateService} from "@ngx-translate/core";
import {TrackApp} from "./services/track-app";
import {DomSanitizer} from "@angular/platform-browser";

export class BaseComponent {

  protected readonly router = inject(Router);
  protected readonly httpApp = inject(HttpApp);
  protected readonly localeApp = inject(LocaleApp);
  protected readonly signalApp = inject(SignalApp);
  protected readonly translate = inject(TranslateService);
  protected readonly tealium = inject(TrackApp);
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
