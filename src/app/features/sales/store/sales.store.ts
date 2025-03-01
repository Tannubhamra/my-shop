import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { salesChart } from "../interfaces/sales";

@Injectable({
    providedIn: "root"
})

export class SalesStore {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api';

    readonly salesData = signal<salesChart | null >(null);

    constructor (){}

    getSales() {
        this.http.get<salesChart>(`${this.apiUrl}/chart-data`)
        .subscribe({
            next: (data) => this.salesData.set(data),
            error: (err) => console.log('Error in fetching Sales Data!', err)
        }) 
    }  
    
      /** Computed Values */
      months = computed(() => this.salesData()?.months ?? []);
      laptopSales = computed(() => this.salesData()?.salesByCategory.laptop ?? []);
      smartphoneSales = computed(() => this.salesData()?.salesByCategory.smartphone ?? []);
      headphoneSales = computed(() => this.salesData()?.salesByCategory.headphone ?? []);
      tabletSales = computed(() => this.salesData()?.salesByCategory.tablet ?? []);

}