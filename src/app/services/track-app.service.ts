import {inject, Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {LocaleAppService} from "./locale-app.service";

declare const utag: {
  view: (data: object) => void;
  link: (data: object) => void;
} | undefined;

/**
 * Defines the shape of the data that can be tracked.
 * All properties are optional except for pageUrl.
 */
export interface TrackData {
  pageUrl: string;
  clientId?: string;
  pageName?: string;
  pageType?: string;
  referrer?: string;
  search?: string;
  title?: string;
  userAgent?: string;
  event?: string;
}

@Injectable({
  providedIn: "root"
})
export class TrackAppService {

  private locale = inject(LocaleAppService);
  private initialized = false;

  constructor() {
  }

  init() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    if (environment.enableTrackData) {
      this.injectScript(environment.trackDataUrl);
    }
  }

  trackPage(data: TrackData) {
    if (typeof utag !== "undefined") {
      const payload = this.buildTrackPayload(data);
      utag.view(payload);
    } else {
      console.warn("`utag.view` was not initialized. Payload:", data);
    }
  }

  trackEvent(data: TrackData) {
    if (typeof utag !== "undefined") {
      const payload = this.buildTrackPayload(data);
      utag.link(payload);
    } else {
      console.warn("`utag.link` was not initialized. Payload:", data);
    }
  }


  private buildTrackPayload(customData: TrackData): object {
    /*
     * Builds the final payload object for Tealium, mapping our
     */

    const payload: { [key: string]: string | undefined } = {
      "locale.id": this.locale.getLocale(),
      "page.url": customData.pageUrl,
      "client.id": customData.clientId,
      "page.name": customData.pageName,
      "page.type": customData.pageType,
      "page.referrer": customData.referrer,
      "page.search": customData.search,
      "page.title": customData.title,
      "page.useragent": customData.userAgent,
      "event.name": customData.event
    };

    // Remove any properties that are undefined to keep the payload clean.
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    return payload;
  }

  private injectScript(url: string) {
    /*
     * Injects the Tealium script into the document body.
     */

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.async = true;
    document.body.appendChild(script);

    console.log("Track script injected");
  }
}
