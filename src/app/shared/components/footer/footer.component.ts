import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  footerText = signal<string>(""); //"2025 Your Company. All Rights Reserved";

  constructor(){
    const year = new Date().getFullYear();
    const footerText = `${year} All Rights Reserved`;
    this.footerText.set(footerText);
  }
}
