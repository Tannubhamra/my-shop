import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Products } from '../../interfaces/products';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = "http://localhost:3000/api";
  private http =  inject(HttpClient)

  getProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(`${this.apiUrl}/products`)
  }

  getProductById(id:number) :Observable<Products> {
    return this.http.get<Products>(`${this.apiUrl}/product/${id}`)
  }

  deleteProduct(id:number) : Observable<Products> {
    return this.http.delete<Products>(`${this.apiUrl}/product/${id}`)
  }

  addProduct(product:Products): Observable<Products>{
    return this.http.post<Products>(`${this.apiUrl}/product`, product);
  }

  updateProduct(product: Products) : Observable<Products> {
    return this.http.put<Products>(`${this.apiUrl}/product/${product.id}`,product)
  }


}
