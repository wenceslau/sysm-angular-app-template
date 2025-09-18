import { Component } from '@angular/core';
import {BaseComponent} from "../../base-component";
import {FileUploadEvent} from "primeng/fileupload";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends BaseComponent {

  currentLocale = "";

  constructor() {
    super();
  }

  changeLocale() {
    if (this.currentLocale === "en") {
      this.currentLocale = "pt";
    } else {
      this.currentLocale = "en";
    }
    this.localeApp.setLocale(this.currentLocale);
    this.currentLocale = this.localeApp.getLocale();
  }

  onUpload($event: FileUploadEvent) {

  }
}
