import { Component, inject} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from '../environments/environments';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
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

// Legacy Jotform data API URLs
const FORM_ID = environment.formId;
export const API_KEY = environment.apiKey;
export const BASE_URL_FORM = 'https://api.jotform.com/form';
export const BASE_URL_SUBMISSION = 'https://api.jotform.com/submission';
export const COMPILED_URL = BASE_URL_FORM.concat('/', FORM_ID, '/submissions?apiKey=', API_KEY, "&limit=500");
export const ADMIN_PASS = environment.adminPass;
// New Database API URLs
export const API_BASE_URL = 'https://pets.theproprietor.news/api/';
export const API_ENTRIES_URL = API_BASE_URL.concat('entries');
