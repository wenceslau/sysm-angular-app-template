import {inject, Injectable, LOCALE_ID, Optional, Provider, SkipSelf} from '@angular/core';
import {SignalAppService} from './signal-app.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LocaleAppService {
  private initialized = false;
  private router = inject(Router);
  private signalApp = inject(SignalAppService);
  private translate = inject(TranslateService);

  constructor(@Optional() @SkipSelf() parent: LocaleAppService) {
    if (parent) {
      throw new Error('LocaleAppService is already provided');
    }
  }

  init(localeId: string) {
    if (this.initialized) {
      return;
    }
    this.translate.addLangs(['en', 'pt']);
    this.translate.setDefaultLang(localeId);

    this.setLocale(localeId);
    this.subscribeToLocaleChange();
    this.initialized = true;
  }

  setLocale(localeId: string) {
    this.translate.use(localeId);
    localStorage.setItem('locale', localeId);
  }

  getLocale(): string {
    return this.translate.currentLang;
  }

  private subscribeToLocaleChange() {
    //Silent update of the router to apply the new LOCALE_ID
    //To make sure all pipes (date and currency) are updated
    this.signalApp.localeChange.set(true);
    this.translate.onLangChange.subscribe(async () => {
      console.log("Locale changed");
      const currentRoute = this.router.url;
      // await this.router.navigateByUrl("/", {skipLocationChange: true}).then(() => {
      //     this.router.navigate([currentRoute]);
      //   }
      // )
    })
  }

}

export class LocaleId extends String {
  constructor(private localeService: LocaleAppService) {
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
  deps: [LocaleAppService]
};
