import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {CallbackComponent} from "./security/callback/callback.component";
import {LoginComponent} from "./security/login/login.component";
import {LayoutComponent} from "./application/layout/layout.component";
import {AuthGuard} from "./security/auth-guard";
import {HomeComponent} from "./modules/home/home.component";

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "callback", component: CallbackComponent},
  {
    path: "",
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {path: "home", component: HomeComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
