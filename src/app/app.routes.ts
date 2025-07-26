import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent)
  },
  {
    path: 'users/:id/:name',
    loadComponent: () => import('./pages/user-detail/user-detail.component').then(m => m.UserDetailComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: 'template-forms',
    loadComponent: () => import('./pages/template-forms/template-forms.component').then(m => m.TemplateFormsComponent)
  },
  {
    path: 'reactive-forms',
    loadComponent: () => import('./pages/reactive-forms/reactive-forms.component').then(m => m.ReactiveFormsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
