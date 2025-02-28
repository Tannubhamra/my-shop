import { Routes } from '@angular/router';
import { ProductsComponent } from './features/products/components/products/products.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { HomeComponent } from './shared/components/home/home.component';
import { ProductDetailComponent } from './features/products/components/product-detail/product-detail.component';
import { AddProductComponent } from './features/products/components/add-product/add-product.component';


export const routes: Routes = [
    { path: '', redirectTo : '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent }, 
    { path: 'products', component: ProductsComponent },
    { path: 'product/:id', component: ProductDetailComponent},
    { path: 'add-product', component: AddProductComponent},
    { path: 'product/:id/edit', component: AddProductComponent},
    { path: '**', component: NotFoundComponent},
];

