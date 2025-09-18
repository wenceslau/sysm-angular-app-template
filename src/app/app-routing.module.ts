import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./security/login/login.component";
import {CallbackComponent} from "./security/callback/callback.component";
import {LayoutComponent} from "./application/layout/layout.component";
import {HomeComponent} from "./modules/home/home.component";
import {AuthGuard} from "./security/auth-guard";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'callback', component: CallbackComponent},
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {path: 'home', component: HomeComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
