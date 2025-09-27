import {NgModule} from "@angular/core";
import {AuthGuard} from "./security/auth-guard";

import {RouterModule, Routes} from "@angular/router";
import {Login} from "./security/login/login";
import {Callback} from "./security/callback/callback";
import {Layout} from "./application/layout/layout";
import {Sample} from "./modules/sample/sample";
import {Home} from "./modules/home/home";


const routes: Routes = [
  {path: "", redirectTo: "login", pathMatch: "full"},
  {path: "login", component: Login},
  {path: "callback", component: Callback},
  {
    path: "",
    component: Layout,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {path: "home", component: Home},
      {path: "sample", component: Sample},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
