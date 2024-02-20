import { Component} from '@angular/core';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  

    title = 'Pet Library';

    navItems = [
      { name: 'Dashboard', route: '/dash' },
      { name: 'Data Table', route: '/table' },
      // Add more items as needed
    ];

    constructor(public layoutService: LayoutService) { }

}
