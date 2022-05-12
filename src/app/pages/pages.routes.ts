import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfilComponent } from './perfil/perfil.component';
import { LoginGuardGuard } from '../services/service.index';
import { IncidentesComponent } from './incidentes/incidentes.component';
import { CatalogoComponent } from './catalogo/catalogo.component';

const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate:[LoginGuardGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent, data:{ titulo: 'Dashboard', descripcion:'Pagina de Inicio', icon:'ik ik-align-justify'} },
            { path: 'incidentes', component: IncidentesComponent, data:{ titulo: 'Incidentes', descripcion:'Adminsitración de Incidentes', icon:'ik ik-align-justify'} },
            { path: 'catalogo', component: CatalogoComponent, data:{ titulo: 'Catalogo', descripcion:'Administración de Catalogos', icon:'ik ik-align-justify'} },
            { path: 'perfil', component: PerfilComponent, data:{ titulo: 'Mi Perfil', descripcion:'Personaliza tus datos', icon:'ik ik-user'}  },
            { path: '', redirectTo: '/incidentes', pathMatch: 'full' }
        ]
    }
];


export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
