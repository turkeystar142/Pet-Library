import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pet-library';
}

const FORM_ID = '240437381261048';
const API_KEY = '10aab04ed94653cc1953f5e4f9406395';
const BASE_URL = 'https://api.jotform.com/form';
export const COMPILED_URL = BASE_URL.concat('/', FORM_ID, '/submissions?apiKey=', API_KEY);
