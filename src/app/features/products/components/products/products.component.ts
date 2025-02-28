import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductStore } from '../../store/product.store';

@Component({
  selector: 'products',
  imports: [CommonModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  standalone: true
})

export class ProductsComponent implements OnInit {
  store = inject(ProductStore);

  ngOnInit(): void {
    this.store.fetchProducts();
  }

  deleteProduct(id:number){
    if(confirm("Are you sure to delete the project?")){
      this.store.deleteProduct(id);
      this.store.clearMessage(3000);
    }
  }
}

