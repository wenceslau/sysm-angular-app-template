import {Injectable, signal} from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class SignalApp {

  public localeChange = signal<boolean>(false);

  public message = signal<any>(null);
  public loading = signal<boolean>(false);

  constructor() { }
}
