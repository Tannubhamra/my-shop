import { computed, Injectable, signal } from "@angular/core";
import { ProductsService } from "../services/products/products.service";
import { Products } from "../interfaces/products";

@Injectable({
    providedIn: "root"
})
// started with store it's not in use yet.

export class ProductStore {
    private productService = new ProductsService();

    //
    private _products = signal<Products[]>([]);
    Products = computed(() => this._products);  
}