import { computed, Injectable, Signal, signal } from "@angular/core";
import { ProductsService } from "../services/products/products.service";
import { Products } from "../interfaces/products";
import { toSignal } from "@angular/core/rxjs-interop";

@Injectable({
    providedIn: "root"
})

export class ProductStore {

  private products = signal<Products[]>([]);
  private loading = signal(false);         
  private error = signal<string | null>(null);
  public successMessage = signal<string | null>(null); 

  readonly products$ = computed(() => this.products());
  readonly productCount$ = computed(() => this.products().length);
  readonly isLoading$ = computed(() => this.loading());
  readonly error$ = computed(() => this.error());
  readonly successMessage$ = computed(() => this.successMessage());

  constructor(private productService: ProductsService) {
    this.fetchProducts();
  }

  get getProducts() {
    return this.products();
  }
  fetchProducts() {
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (products) => this.products.set(products),
      error: (err) => this.error.set('Failed to fetch products'),
      complete: () => this.loading.set(false),
    });
  }

  addProduct(product: Products) {
    this.productService.addProduct(product).subscribe((newProduct) => {
      this.products.update((current) => [...current, newProduct]);
      this.successMessage.set("Product Added successFully!");
    });
  }

  updateProduct(updatedProduct: Products) {
    this.productService.updateProduct(updatedProduct).subscribe(() => {
      this.products.update((products) =>
        products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      this.successMessage.set(`Product ${updatedProduct.id} Updated successFully!`);
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(() => {
     const updatedProducts = this.products().filter((p) => p.id !== id);   
     this.products.set(updatedProducts);  
     this.successMessage.set(`product with id: ${id} has been deleted`);
    });
  }

  clearMessage(){
    setTimeout( ()=> this.successMessage.set(null), 3000);
  }
}