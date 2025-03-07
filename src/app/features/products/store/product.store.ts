import { computed, Injectable, signal, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Products } from "../interfaces/products";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class ProductStore {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:3000/api";

  private router = inject(Router);

  private products = signal<Products[]>([]);        
  private error = signal<string | null>(null);
  public successMessage = signal<string | null>(null); 

  readonly products$ = computed(() => this.products());
  readonly productCount$ = computed(() => this.products().length);
  readonly error$ = computed(() => this.error());
  readonly successMessage$ = computed(() => this.successMessage());

  constructor() {
    this.fetchProducts();
  }

  get getProducts() {
    return this.products();
  }

  fetchProducts() {
    this.http.get<Products[]>(`${this.apiUrl}/products`).subscribe({
      next: (products) => this.products.set(products),
      error: () => this.error.set('Failed to fetch products'),
    });
  }

  getProductById(id: number) {
    return this.http.get<Products>(`${this.apiUrl}/product/${id}`);
  }

  addProduct(product: Products) {
    this.http.post<Products>(`${this.apiUrl}/product`, product).subscribe({
      next: (newProduct) => {
        this.products.update((current) => [...current, newProduct]);
        this.successMessage.set("Product added successfully!");
        this.clearMessage(5000);
        this.router.navigate(['./products'])
      },
      error: () => this.error.set("Failed to add product")
    });
  }

  updateProduct(updatedProduct: Products) {
    this.http.put<Products>(`${this.apiUrl}/product/${updatedProduct.id}`, updatedProduct)
    .subscribe({
      next: () => {
        this.products.update((products) =>
          products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
        this.successMessage.set(`Product "${updatedProduct.name}" has been updated successfully!`);
        this.clearMessage(5000);
        this.router.navigate(['./products'])
      },
      error: () => this.error.set("Failed to update product")
    });
  }

  deleteProduct(id: number) {
    this.http.delete(`${this.apiUrl}/product/${id}`).subscribe({
      next: () => {
        this.products.set(this.products().filter((p) => p.id !== id));  
        this.successMessage.set(`Product with ID: ${id} has been deleted`);
        this.clearMessage(3000);
      },
      error: () => this.error.set("Failed to delete product")
    });
  }

  clearMessage(val:number) {
    setTimeout(() => this.successMessage.set(null), val);
  }
}
