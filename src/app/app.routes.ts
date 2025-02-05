import { Routes } from '@angular/router';
import { ProductsComponent } from './products/components/products/products.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { HomeComponent } from './shared/home/home.component';
import { ProductDetailComponent } from './products/components/product-detail/product-detail.component';
import { AddProductComponent } from './products/components/add-product/add-product.component';


export const routes: Routes = [
    { path: '', redirectTo : '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent }, 
    { path: 'products', component: ProductsComponent },
    { path: 'product/:id', component: ProductDetailComponent},
    { path: 'add-product', component: AddProductComponent},
    { path: '**', component: NotFoundComponent},
];

