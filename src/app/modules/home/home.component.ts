import {Component} from '@angular/core';
import {BaseComponent} from "../../base-component";
import {FileUploadEvent} from "primeng/fileupload";
import {Request} from "../../services/http-app.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends BaseComponent {

  currentLocale = "";
  response: string = "";

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

  async testHttp(verb: string) {
    let request = new Request("/template/hello");
    let response = "";
    if (verb === "GET") {
      response = await this.httpApp.getAsync<any>(request);

    } else if (verb === "POST") {
      request.payload = "Test post";
      response = await this.httpApp.postAsync<any>(request);

    } else if (verb === "PUT") {
      request.customPath += "/10";
      request.payload = "Test put";
      response = await this.httpApp.putAsync<any>(request);

    } else if (verb === "DELETE") {
      request.customPath += "/10";
      await this.httpApp.deleteAsync<any>(request);
      response = "Deleted";

    } else if (verb === "PATCH") {
      request.customPath +=  "/10";
      request.payload = "Test patch";
      response = await this.httpApp.patchAsync<any>(request);

    } else if (verb === "D-POST") {
      request.customPath = "/template/download";
      request.payload = "sample-download";
      await this.httpApp.downloadAsync(request, "file.txt",'POST');
      response = "Downloaded";

    } else if (verb === "D-GET") {
      request.customPath = "/template/download";
      await this.httpApp.downloadAsync(request, "file.txt",'GET');
      response = "Downloaded";

    }
    this.response = response;
  }
}
