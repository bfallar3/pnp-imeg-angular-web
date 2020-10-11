import { DosiersComponent } from './dosiers/dosiers.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { RolesComponent } from 'app/roles/roles.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { CreateComplaintComponent } from './complaints/create-complaint/create-complaint.component';
import { EditComplaintComponent } from './complaints/edit-complaint/edit-complaint.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                children: [
                    {
                        path: 'home', component: HomeComponent,
                        canActivate: [AppRouteGuard]
                    },
                    {
                        path: 'complaints', component: ComplaintsComponent,
                        canActivate: [AppRouteGuard]
                    },
                    {
                        path: 'create-complaint', component: CreateComplaintComponent
                    },
                    {
                        path: 'edit-complaint', component: EditComplaintComponent
                    },
                    {
                        path: 'dosiers', component: DosiersComponent, canActivate: [AppRouteGuard]
                    },
                    {
                        path: 'users', component: UsersComponent, data: { permission: 'Pages.Users' },
                        canActivate: [AppRouteGuard]
                    },
                    {
                        path: 'roles', component: RolesComponent, data: { permission: 'Pages.Roles' },
                        canActivate: [AppRouteGuard]
                    },
                    {
                        path: 'about', component: AboutComponent
                    },
                    {
                        path: 'update-password', component: ChangePasswordComponent
                    }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
