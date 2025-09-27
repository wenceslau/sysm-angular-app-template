import {Component, ViewChild} from "@angular/core";
import {BaseComponent} from "../../base-component";
import {FileUpload, FileUploadEvent, FileUploadHandlerEvent} from "primeng/fileupload";
import {Request} from "../../services/http-app.service";
import {SelectButtonChangeEvent} from "primeng/selectbutton";

@Component({
  selector: "app-home",
  standalone: false,
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss"
})
export class HomeComponent extends BaseComponent {

}
