import { Component } from '@angular/core';
import { SalesComponent } from '../../../features/sales/components/sales/sales.component';

@Component({
  selector: 'app-home',
  imports: [SalesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
