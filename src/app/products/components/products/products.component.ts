import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Products } from '../../interfaces/products';
import { ProductsService } from '../../services/products/products.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'products',
  imports: [CommonModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  standalone: true
})

export class ProductsComponent implements OnInit {
  productList: Products[] = [];

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (res) => {
        this.productList = res
      },
      error: (error) => {
        console.log(`Error fetching products`, error)
      }
    })
  }

  deleteProduct(id:number){
    if(confirm("Are you sure to delete the project")){
      this.productsService.deleteProduct(id).subscribe({
        next: (res) => { 
          console.log(`Product ${id} has been deleted sucessfully!`, res);
          this.fetchProducts();
        },
        error: (error) => {
          console.log('Error in deleting Product', error);
        }
      })
    }
  }
}

