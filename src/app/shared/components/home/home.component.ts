import { Component } from '@angular/core';
import { SalesComponent } from '../../../features/sales/components/sales-bar-chart/sales-bar-chart.component';
import { SalesLineChartComponent } from "../../../features/sales/components/sales-line-chart/sales-line-chart.component";

@Component({
  selector: 'app-home',
  imports: [SalesComponent, SalesLineChartComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
