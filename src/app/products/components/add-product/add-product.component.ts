import { Component, EventEmitter, inject, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductStore } from '../../store/product.store';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
  standalone: true,
})
export class AddProductComponent implements OnInit {

  productId: WritableSignal<number | null> = signal(null);

  @Output() formSubmitted = new EventEmitter<void>();
  
  private fb = inject(FormBuilder)
  public store = inject(ProductStore);
  private route = inject(ActivatedRoute);

  constructor() {
  const routeId = toSignal(
    this.route.paramMap.pipe(
      map(params => {
        const id = params.get('id');
        return id ? Number(id) : null;
      })
    )
  );
  this.productId.set(routeId() ?? null);
  }

  ProductForm: FormGroup = this.fb.group({
    name: ["", Validators.required],
    description: ["",Validators.required ],
    price: ["0.00$"],
    status: [false]
  });

  ngOnInit(): void {
    if( this.productId()){
      const product = this.store.products$().find((p) => p.id === this.productId());
      if(product){
        this.ProductForm.patchValue(product);
      }
    }
  }
  saveProduct(): void {

    if (this.ProductForm.invalid) return;
    const productData = this.ProductForm.value;

    if (this.productId()) {
      this.store.updateProduct({ ...productData, id: this.productId() });
    } else {
      this.store.addProduct(productData);
    }
    this.formSubmitted.emit();
    this.ProductForm.reset({ name: '', description: '', price: '', status: true });

    this.store.clearMessage();
  }
}
