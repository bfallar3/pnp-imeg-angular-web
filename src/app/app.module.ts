import { ComplaintDashboardDtoResolver } from './home/home-resolver';
import { DosierItemServiceProxy } from './../shared/service-proxies/service-proxies';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';
import { HomeComponent } from '@app/home/home.component';
import { AboutComponent } from '@app/about/about.component';
// tenants
import { TenantsComponent } from '@app/tenants/tenants.component';
import { CreateTenantDialogComponent } from './tenants/create-tenant/create-tenant-dialog.component';
import { EditTenantDialogComponent } from './tenants/edit-tenant/edit-tenant-dialog.component';
// roles
import { RolesComponent } from '@app/roles/roles.component';
import { CreateRoleDialogComponent } from './roles/create-role/create-role-dialog.component';
import { EditRoleDialogComponent } from './roles/edit-role/edit-role-dialog.component';
// users
import { UsersComponent } from '@app/users/users.component';
import { CreateUserDialogComponent } from '@app/users/create-user/create-user-dialog.component';
import { EditUserDialogComponent } from '@app/users/edit-user/edit-user-dialog.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { ResetPasswordDialogComponent } from './users/reset-password/reset-password.component';
// layout
import { HeaderComponent } from './layout/header.component';
import { HeaderLeftNavbarComponent } from './layout/header-left-navbar.component';
import { HeaderLanguageMenuComponent } from './layout/header-language-menu.component';
import { HeaderUserMenuComponent } from './layout/header-user-menu.component';
import { FooterComponent } from './layout/footer.component';
import { SidebarComponent } from './layout/sidebar.component';
import { SidebarLogoComponent } from './layout/sidebar-logo.component';
import { SidebarUserPanelComponent } from './layout/sidebar-user-panel.component';
import { SidebarMenuComponent } from './layout/sidebar-menu.component';

import { ComplaintsComponent } from './complaints/complaints.component';
import { DosiersComponent } from './dosiers/dosiers.component';
import { CreateComplaintComponent } from './complaints/create-complaint/create-complaint.component';
import { EditComplaintComponent } from './complaints/edit-complaint/edit-complaint.component';
import { PersonsComponent } from './persons/persons.component';
import { CreatePersonDialogComponent } from './persons/create-person-dialog/create-person-dialog.component';
import { EditPersonDialogComponent } from './persons/edit-person-dialog/edit-person-dialog.component';
import { VictimsComponent } from './victims/victims.component';
import { SuspectsComponent } from './suspects/suspects.component';
import { WitnessesComponent } from './witnesses/witnesses.component';
import { DosierServiceProxy, SuspectServiceProxy, VictimServiceProxy, WitnessServiceProxy } from '@shared/service-proxies/service-proxies';
import { ComplaintDtoResolver } from './complaints/edit-complaint/edit-complaint-resolver';
import { CreateDosierComponent } from './dosiers/create-dosier/create-dosier.component';
import { EditDosierComponent } from './dosiers/edit-dosier/edit-dosier.component';
import { CreateDosierItemDialogComponent } from './dosiers/create-dosier-item-dialog/create-dosier-item-dialog.component';
import { DosierDtoResolver } from './dosiers/edit-dosier/edit-dosier-resolver';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DosierItemViewerComponent } from './dosiers/dosier-item-viewer/dosier-item-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    // tenants
    TenantsComponent,
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    RolesComponent,
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    UsersComponent,
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ChangePasswordComponent,
    ResetPasswordDialogComponent,
    // layout
    HeaderComponent,
    HeaderLeftNavbarComponent,
    HeaderLanguageMenuComponent,
    HeaderUserMenuComponent,
    FooterComponent,
    SidebarComponent,
    SidebarLogoComponent,
    SidebarUserPanelComponent,
    SidebarMenuComponent,
    // Complaints
    ComplaintsComponent,
    CreateComplaintComponent,
    EditComplaintComponent,
    PersonsComponent,
    CreatePersonDialogComponent,
    EditPersonDialogComponent,
    VictimsComponent,
    SuspectsComponent,
    WitnessesComponent,
    // Dosiers
    DosiersComponent,
    CreateDosierComponent,
    EditDosierComponent,
    CreateDosierItemDialogComponent,
    DosierItemViewerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ModalModule.forChild(),
    BsDropdownModule,
    CollapseModule,
    TabsModule,
    AppRoutingModule,
    ServiceProxyModule,
    SharedModule,
    NgxPaginationModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    TooltipModule.forRoot(),
    PdfViewerModule
  ],
  providers: [
    SuspectServiceProxy,
    WitnessServiceProxy,
    VictimServiceProxy,
    DosierServiceProxy,
    DosierItemServiceProxy,
    // resolvers
    ComplaintDtoResolver,
    ComplaintDashboardDtoResolver,
    DosierDtoResolver
    ],
  entryComponents: [
    // tenants
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ResetPasswordDialogComponent
  ],
})
export class AppModule { }
