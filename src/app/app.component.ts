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

const FORM_ID = '230875653758066';
export const API_KEY = '0711cf08a9cdf2358d054fe59496e830';
export const BASE_URL_FORM = 'https://api.jotform.com/form';
export const BASE_URL_SUBMISSION = 'https://api.jotform.com/submission';
export const COMPILED_URL = BASE_URL_FORM.concat('/', FORM_ID, '/submissions?apiKey=', API_KEY);