import {inject, Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {LocaleAppService} from "./locale-app.service";

declare const utag: {
  view: (data: object) => void;
  link: (data: object) => void;
} | undefined;

export class CustomData {
  constructor(pageUrl: string) {
    this.pageUrl = pageUrl;
  }
  clientId: string | undefined;
  pageName: string | undefined;
  pageType: string | undefined;
  pageUrl: string | undefined;
  referrer: string | undefined;
  search: string | undefined;
  title: string | undefined;
  userAgent: string | undefined;
  event: string | undefined;
}

@Injectable({
  providedIn: "root"
})
export class TealiumAppService {

  private locale = inject(LocaleAppService);
  private initialized = false;

  constructor() {
  }

  init() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    if (environment.enableTealium) {
      this.injectScript(environment.tealiumUrl);
    }
  }

  trackPage(customData: CustomData) {
    if (typeof utag !== "undefined") {
      this.buildUtagData(customData);
      utag.view(customData);
    } else {
      console.log("Tealium not initialized");
    }
  }

  trackEvent(customData: CustomData) {
    if (typeof utag !== "undefined") {
      this.buildUtagData(customData);
      utag.link(customData);
    } else {
      console.log("Tealium not initialized");
    }
  }

  private buildUtagData(customData: CustomData) {
    /*
     * Build the utag data object from the custom data
     */

    const data = {
      "locale.id": this.locale.getLocale(),
      "page.url": customData.pageUrl,
    } as any;
    if (customData.clientId) {
      data["client.id"] = customData.clientId;
    }
    if (customData.pageName) {
      data["page.name"] = customData.pageName;
    }
    if (customData.pageType) {
      data["page.type"] = customData.pageType;
    }
    if (customData.referrer) {
      data["page.referrer"] = customData.referrer;
    }
    if (customData.search) {
      data["page.search"] = customData.search;
    }
    if (customData.title) {
      data["page.title"] = customData.title;
    }
    if (customData.userAgent) {
      data["page.useragent"] = customData.userAgent;
    }
    if (customData.event) {
      data["event.name"] = customData.event;
    }
  }

  private injectScript(url: string) {
    /*
     * Inject the Tealium script into the document body
     * @param url - Dynamic URL of the Tealium script
     */

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.async = true;
    document.body.appendChild(script);

    console.log("Tealium script injected");
  }
}
