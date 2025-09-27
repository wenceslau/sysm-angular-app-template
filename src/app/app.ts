import {Component, inject, signal} from "@angular/core";
import {filter} from "rxjs";

import {TrackApp} from "./services/track-app";
import {LocaleApp} from "./services/locale-app";
import {NavigationEnd, Router} from "@angular/router";


@Component({
  selector: "app-root",
  templateUrl: "./app.html",
  standalone: false,
  styleUrl: "./app.scss"
})
export class App {

  protected readonly title = signal('sysm-angular-app-template');

  private tealium = inject(TrackApp)
  private locale = inject(LocaleApp)
  private router = inject(Router)

  constructor() {
    const locale = localStorage.getItem("locale") || "en";
    this.locale.init(locale)
    this.tealium.init();
  }

  ngOnInit(): void {
    this.subscribeToRouterEvents();
  }

  protected subscribeToRouterEvents(): void {
    /*
     * Subscribe to router events to track page views
     */

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
        this.tealium.trackPage({pageUrl: event.urlAfterRedirects});
      }
    )
  }




}
