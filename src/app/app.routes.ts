import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { programadorGuard } from './core/guards/programador-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./public/pages/home/home').then(m => m.Home),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login').then(m => m.Login),
  },
  
  // --- INICIO DE RUTAS PÚBLICAS NUEVAS ---
  {
    path: 'portafolios',
    loadComponent: () => 
      import('./public/pages/programadores/programadores').then(m => m.Programadores),
  },
  {
    path: 'portafolio/:id', // El :id es vital para saber qué perfil mostrar
    loadComponent: () => 
      import('./public/pages/portafolio/portafolio').then(m => m.Portafolio),
  },
  // --- FIN DE RUTAS PÚBLICAS NUEVAS ---

  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./admin/admin-dashboard/admin-dashboard')
        .then(m => m.AdminDashboard),
  },
  {
    path: 'programador',
    canActivate: [authGuard, programadorGuard],
    loadComponent: () =>
      import('./programador/dashboard/dashboard')
        .then(m => m.Dashboard),
  },
  { path: '**', redirectTo: '' },
];