import { Component, signal } from '@angular/core';
import { ContractFormComponent } from './contract-form.component';

@Component({
  selector: 'app-root',
  imports: [ContractFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ng-strapi-poc');
}
