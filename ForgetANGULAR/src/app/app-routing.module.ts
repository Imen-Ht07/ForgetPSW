import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { HomeComponent } from './components/home/home.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ForgotPswComponent } from './components/forgot-psw/forgot-psw.component';
import { ResetPswComponent } from './components/reset-psw/reset-psw.component';


import { authGuard } from './auth.guard';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user-list', component: UserListComponent , canActivate: [authGuard] , data: { role: 'admin' }},
  { path: 'update-user/:id', component: UpdateUserComponent , canActivate: [authGuard] ,  data: { role: 'admin' }  },
  { path: 'home', component: HomeComponent , canActivate: [authGuard] },  
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'forgot-psw', component: ForgotPswComponent },
  ///reset-password/${resetToken}
  { path: 'reset-password/:userId/:token', component: ResetPswComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
