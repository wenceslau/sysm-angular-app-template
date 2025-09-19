import {Component, inject, OnInit} from '@angular/core';
import {CustomData, TealiumAppService} from "./services/tealium-app.service";
import {LocaleAppService} from "./services/locale-app.service";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private tealium = inject(TealiumAppService)
  private locale = inject(LocaleAppService)
  private router = inject(Router)

  constructor() {
  }

  ngOnInit(): void {
    const locale = localStorage.getItem('locale') || 'en';
    this.locale.init(locale)
    this.tealium.init();
    this.subscribeToRouterEvents();
  }

  protected subscribeToRouterEvents(): void {
    /*
     * Subscribe to router events to track page views
     */

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
        this.tealium.trackPage(new CustomData(event.urlAfterRedirects));
      }
    )
  }
}
