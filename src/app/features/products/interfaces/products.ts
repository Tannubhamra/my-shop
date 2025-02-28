export interface Products {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sales: number[];
}
export interface ChartData {
  months: string[];
  laptopSales: number[];
  smartphoneSales: number[];
  headphonesSales: number[];
  smartwatchSales: number[];
}
export interface ProductState {
  products: Products[];
  chartData: ChartData | null;
}