import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { AddProductComponent } from './components/add-product/add-product.component';

export const ProductRoutes: Routes = [
  { path: '', component: ProductsComponent }, 
  { path: 'add', component: AddProductComponent }, 
  { path: ':id', component: ProductDetailComponent }, 
  { path: ':id/edit', component: AddProductComponent }, 
];
