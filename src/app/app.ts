import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContractFormComponent } from './contract-form.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ContractFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ng-strapi-poc');
}
