import { NgModule } from "@angular/core";
import { PAGES_ROUTES } from './pages.routes';

import { SharedModule } from '../shared/shared.module';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TemplateComponent } from './template/template.component';
import { PagesComponent } from './pages.component';

import { PerfilComponent } from './perfil/perfil.component';

import {CalendarModule} from 'primeng/calendar';
import {ChipsModule} from 'primeng/chips';


import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MultiSelectModule} from 'primeng/multiselect'
import {DropdownModule} from 'primeng/dropdown';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { IncidentesComponent } from './incidentes/incidentes.component';
import { CatalogoComponent } from './catalogo/catalogo.component';

@NgModule({
declarations:[
    PagesComponent,
    DashboardComponent,
    TemplateComponent,
    PerfilComponent,
    IncidentesComponent,
    CatalogoComponent,
],
exports:[
    DashboardComponent,
    TemplateComponent,
],
imports:[
    CommonModule,
    SharedModule,
    PAGES_ROUTES,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    ChipsModule,
    NgbModule,
    MultiSelectModule,
    DropdownModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    Ng2SearchPipeModule
]

})

export class PagesModule { }
