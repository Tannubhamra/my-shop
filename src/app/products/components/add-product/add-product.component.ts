import { Component, Signal, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products/products.service';
import { CommonModule } from '@angular/common';
import { Products } from '../../interfaces/products';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
  standalone: true,
})
export class AddProductComponent {
  private fb = new FormBuilder();
  private productService = new ProductsService();

  addProductForm: FormGroup = this.fb.group({
    name: ["", Validators.required],
    description: ["",Validators.required ],
    price: [0],
    status: [true]
  });
  // signal for success Message
  successMessage = signal<string | null>(null); 

  addProduct(): void {
    if(this.addProductForm.invalid) return;

    const newProduct : Products = this.addProductForm.value;
    console.log(newProduct);
    this.productService.addProduct(newProduct).subscribe({
      next: (res)=> {
        this.successMessage.set("Product Added Successfully!");
        this.addProductForm.reset({
          name: "",
          description: "",
          price: 0,
          status: true
        });
      },
      error: (err)=> {
        console.log("Error in adding Project", err)
      }
    })
  }

}
