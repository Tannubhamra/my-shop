import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Products } from '../../interfaces/products';
import { ProductStore } from '../../store/product.store';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  standalone:true
})
export class ProductDetailComponent implements OnInit {
  product!: Products;
    store = inject(ProductStore);

  constructor( 
    private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
         const productId = params['id']; 
          this.fetchProductsById(productId);
        })
    }
    fetchProductsById(productId:number) {
      this.store.getProductById(productId).subscribe({
        next : (res) => {
          this.product = res;
        },
        error: (error) => {
          console.log(`Error fetching products`, error)
        }
      })
    }
}



