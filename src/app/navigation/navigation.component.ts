import { Component} from '@angular/core';
import { LayoutService } from '../layout.service';
import { AuthService, User } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    standalone: false
})
export class NavigationComponent {
  

    title = 'Pet Library';

    navItems = [
      { name: 'Dashboard', route: '/dash' },
      { name: 'Data Table', route: '/table' },
      // Add more items as needed
    ];

    currentUser$: Observable<User | null>;

    constructor(
      public layoutService: LayoutService,
      private authService: AuthService
    ) {
      this.currentUser$ = this.authService.currentUser$;
    }

    logout(): void {
      this.authService.logout();
    }

    get isAdmin(): boolean {
      return this.authService.isAdmin();
    }

}
