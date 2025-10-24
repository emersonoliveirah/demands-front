import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/signup/signup.component';
import { UserComponent } from './pages/user/user.component';
import { AuthGuard } from './services/auth-guard.service';
import { DemandsPageComponent } from './pages/demands/demands-page.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "signup",
    component: SignUpComponent
  },
  {
    path: "user",
    component: UserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "demands-page",
    component: DemandsPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "manager-dashboard",
    component: ManagerDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  }
];
