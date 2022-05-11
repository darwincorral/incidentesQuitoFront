import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfilComponent } from './perfil/perfil.component';
import { LoginGuardGuard } from '../services/service.index';

const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate:[LoginGuardGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent, data:{ titulo: 'Dashboard', descripcion:'Pagina de Inicio', icon:'ik ik-align-justify'} },
            { path: 'perfil', component: PerfilComponent, data:{ titulo: 'Mi Perfil', descripcion:'Personaliza tus datos', icon:'ik ik-user'}  },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
        ]
    }
];


export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
