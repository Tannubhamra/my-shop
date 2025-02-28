import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { HomeComponent } from './shared/components/home/home.component';

export const routes: Routes = [
    { path: '', redirectTo : '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent }, 
    {
        path: 'products',
        loadChildren: () =>
          import('./features/products/product.routes').then(m => m.ProductRoutes),
      },
    { path: '**', component: NotFoundComponent},
];

