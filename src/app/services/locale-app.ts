import {inject, Injectable, LOCALE_ID, Optional, Provider, SkipSelf} from "@angular/core";
import {Router} from "@angular/router";
import {SignalApp} from "./signal-app";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: "root"
})
export class LocaleApp {
  private initialized = false;
  private router = inject(Router);
  private signalApp = inject(SignalApp);
  private translate = inject(TranslateService);

  constructor(@Optional() @SkipSelf() parent: LocaleApp) {
    if (parent) {
      throw new Error("LocaleAppService is already provided");
    }
  }

  init(localeId: string) {
    if (this.initialized) {
      return;
    }
    this.translate.addLangs(["en", "pt", "fr"]);
    this.translate.setFallbackLang(localeId);

    this.setLocale(localeId);
    this.subscribeToLocaleChange();
    this.initialized = true;
  }

  setLocale(localeId: string) {
    this.translate.use(localeId);
    localStorage.setItem("locale", localeId);
  }

  getLocale(): string {
    return this.translate.getCurrentLang();
  }

  private subscribeToLocaleChange() {
    // When the language changes, we need to force Angular to re-render the current
    // component. This is necessary so that all pipes (like date, currency, etc.)
    // are recreated and pick up the new LOCALE_ID.
    this.translate.onLangChange.subscribe(async () => {
      this.signalApp.localeChange.set(true);
      const currentUrl = this.router.url;
      await this.router.navigateByUrl("/", { skipLocationChange: true });
      await this.router.navigateByUrl(currentUrl);
    });
  }

}

export class LocaleId extends String {
  constructor(private localeService: LocaleApp) {
    super();
  }

  override toString(): string {
    return this.localeService.getLocale();
  }

  override valueOf(): string {
    return this.toString();
  }
}

export const LocaleProvider: Provider = {
  provide: LOCALE_ID,
  useClass: LocaleId,
  deps: [LocaleApp]
};
