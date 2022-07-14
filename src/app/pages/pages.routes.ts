import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfilComponent } from './perfil/perfil.component';
import { LoginGuardGuard } from '../services/service.index';
import { IncidentesComponent } from './incidentes/incidentes.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { AdminGuard } from '../services/guards/admin.guard';
import { ReportesComponent } from './reportes/reportes.component';
import { AsignacionesComponent } from './asignaciones/asignaciones.component';

const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate:[LoginGuardGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent,canActivate:[AdminGuard], data:{ titulo: 'Dashboard', descripcion:'Pagina de Inicio', icon:'ik ik-align-justify'} },
            { path: 'incidentes', component: IncidentesComponent, data:{ titulo: 'Incidentes', descripcion:'Adminsitración de Incidentes', icon:'fas fa-car-crash'} },
            { path: 'reportes', component: ReportesComponent, data:{ titulo: 'Reportes', descripcion:'Reportes', icon:'ik ik-file-text '} },
            { path: 'asignaciones', component: AsignacionesComponent, data:{ titulo: 'Asignaciones', descripcion:'Asignación de Zonas a Operadores', icon:'ik ik-file-text '} },
            { path: 'catalogos', component: CatalogoComponent, data:{ titulo: 'Catalogo', descripcion:'Administración de Catalogos', icon:'fas fa-project-diagram'} },
            { path: 'perfil', component: PerfilComponent, data:{ titulo: 'Mi Perfil', descripcion:'Personaliza tus datos', icon:'ik ik-user'}  },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
        ]
    }
];


export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
