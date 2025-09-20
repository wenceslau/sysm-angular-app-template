import {Component, ViewChild} from '@angular/core';
import {BaseComponent} from "../../base-component";
import {FileUpload, FileUploadEvent, FileUploadHandlerEvent} from "primeng/fileupload";
import {Request} from "../../services/http-app.service";
import {SelectButtonChangeEvent} from "primeng/selectbutton";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends BaseComponent {

  @ViewChild('customFileUploader') customFileUploader!: FileUpload;
  stateOptions: any[] = [{label: 'EN', value: 'en'}, {label: 'PT', value: 'pt'}, {label: 'FR', value: 'fr'}];
  response: any;
  currentValue = 'en'
  currentDate = new Date();

  constructor() {
    super();
    this.currentValue = this.localeApp.getLocale();
  }

  changeLocale(event: SelectButtonChangeEvent) {
    this.localeApp.setLocale(event.value);
  }

  urlUpload() {
    return this.httpApp.apiUrl + "/template/upload";
  }

  onUpload(event: FileUploadEvent) {
    let originalEvent = event.originalEvent as any;
    this.response = originalEvent.body;
  }

  customUpload() {
    if (this.customFileUploader?.files.length != 0) {
      this.customFileUploader.upload();
    }
  }

  async onUploadHandler(event: FileUploadHandlerEvent) {
    try {
      if (!event.files || event.files.length === 0) {
        return;
      }
      const fileBlob = event.files[0];
      const formData = new FormData();
      formData.append('value', 'Custom value');

      this.response = await this.httpApp.uploadAsync(formData, fileBlob, "/template/custom-upload");
    } catch (error) {
      if (error instanceof Error) {
        this.response = (error as Error).message;
      } else {
        this.response = error;
      }
    }
  }

  async testHttp(verb: string) {
    let request = new Request("/template/hello");
    let response = "";
    try {
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
        request.customPath += "/10";
        request.payload = "Test patch";
        response = await this.httpApp.patchAsync<any>(request);

      } else if (verb === "D-POST") {
        request.customPath = "/template/download";
        request.payload = "sample-download";
        await this.httpApp.downloadAsync(request, "file.txt", 'POST');
        response = "Downloaded";

      } else if (verb === "D-GET") {
        request.customPath = "/template/download";
        await this.httpApp.downloadAsync(request, "file.txt", 'GET');
        response = "Downloaded";
      }
      this.response = response;

    } catch (error) {
      this.response = error;
    }
  }
}
