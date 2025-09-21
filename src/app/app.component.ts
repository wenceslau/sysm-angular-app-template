import {Component, inject, OnInit} from "@angular/core";
import {LocaleAppService} from "./services/locale-app.service";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {TrackAppService} from "./services/track-app.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  standalone: false,
  styleUrl: "./app.component.scss"
})
export class AppComponent implements OnInit {

  private tealium = inject(TrackAppService)
  private locale = inject(LocaleAppService)
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
