import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductsService } from '../../services/products/products.service';
import { Products } from '../../interfaces/products';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  standalone:true
})
export class ProductDetailComponent implements OnInit {
  product!: Products;

  constructor( 
    private route: ActivatedRoute, 
    private productsService: ProductsService) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
         const productId = params['id']; 
          this.fetchProductsById(productId);
        })
    }
    fetchProductsById(productId:number) {
      this.productsService.getProductById(productId).subscribe({
        next : (res) => {
          this.product = res;
        },
        error: (error) => {
          console.log(`Error fetching products`, error)
        }
      })
    }
}



