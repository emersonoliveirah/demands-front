import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/signup/signup.component';
import { UserComponent } from './pages/user/user.component';
import { AuthGuard } from './services/auth-guard.service';
import { DemandsPageComponent } from './pages/demands/demands-page.component';

export const routes: Routes = [
    {
        path: "",
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
    }
];
