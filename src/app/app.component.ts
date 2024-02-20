import { Component, inject} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pet-library';
  
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}

const FORM_ID = '240437381261048';
const API_KEY = '10aab04ed94653cc1953f5e4f9406395';
const BASE_URL = 'https://api.jotform.com/form';
export const COMPILED_URL = BASE_URL.concat('/', FORM_ID, '/submissions?apiKey=', API_KEY);