import {Component, signal} from "@angular/core";
import {BaseComponent} from "../../base-component";

@Component({
  selector: "app-layout",
  standalone: false,
  templateUrl: "./layout.html",
  styleUrl: "./layout.scss"
})
export class Layout extends BaseComponent{

  protected readonly signal = signal;
}
