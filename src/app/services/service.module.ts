import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SidebarService, UsuarioService, LoginGuardGuard, UiServicesService} from './service.index';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  providers: [
    SidebarService,
    UsuarioService,
    LoginGuardGuard,
    UiServicesService
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class ServiceModule { }
