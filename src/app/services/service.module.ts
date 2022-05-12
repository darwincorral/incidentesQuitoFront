import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SidebarService, UsuarioService, LoginGuardGuard, UiServicesService,CatalogosService,IncidentesService} from './service.index';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  providers: [
    SidebarService,
    UsuarioService,
    LoginGuardGuard,
    UiServicesService,
    IncidentesService,
    CatalogosService
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class ServiceModule { }
