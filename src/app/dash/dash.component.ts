import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { COMPILED_URL } from '../app.component';
import { Router } from '@angular/router';

interface Card {
  name: string;
  owner_name: string;
  pet_type: string;
  breed: string;
  pet_color: string;
  location: string;
  phone: string;
  email: string;
  pet_photo: string;
  id: string;
  cols: number;
  rows: number;
  flip: boolean;
}

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private http = inject(HttpClient);
  private dataSubject = new BehaviorSubject<Card[]>([]);
  cards!: Observable<Card[]>;
  placeholderImage = 'src/assets/image-404.png';

  columns: number = 5;
  searchTerm = new BehaviorSubject<string>('');
  
  constructor(private router: Router) {
    this.columns = this.getNumberOfColumns();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.columns = this.getNumberOfColumns();
  }

  ngOnInit() {
    this.http.get<{content: any[]}>(COMPILED_URL).subscribe(response => {
      const data = response.content.map(item => {
        return {
          name: item.answers['23'].answer, // '7' is the key for the 'Pet Name 1' question
          pet_type: item.answers['7'].answer, // '8' is the key for the 'Pet Type' question
          breed: item.answers['9'].answer, // '5' is the key for the 'Breed' question
          pet_color: item.answers['20'].answer, // '6' is the key for the 'Pet Color' question
          owner_name: item.answers['4'].prettyFormat, // '16' is the key for the 'Owner\'s Name' question
          id: item.id, // Convert the id to a number using the unary plus operator
          location: item.answers['3'].prettyFormat, // '19' is the key for the 'Location' question
          pet_photo: item.answers['19'].answer[0] ? item.answers['19'].answer[0]: this.placeholderImage, // '28' is the key for the 'photo' question
          email: item.answers['5'].answer, // '22' is the key for the 'Email' question
          phone: item.answers['6'].prettyFormat, // '21' is the key for the 'Phone' question
          cols: 1,
          rows: 1,
          flip: false
        };
      });
      this.dataSubject.next(data);
    

    this.cards = combineLatest([ this.breakpointObserver.observe(Breakpoints.Handset), this.searchTerm])
      .pipe(
        map(([breakpointState, searchTerm]) => {
          let cards = this.dataSubject.value.map(card => ({ ...card, cols: 1, rows: 1, flip: false}));
        
          if (breakpointState.matches) {
            cards = cards.map(card => ({ ...card, cols: 1, rows: 1, flip: false}));
          }
          
          const searchTermLower = searchTerm.toLowerCase();

        // Filter cards based on the search term
        cards = cards.filter(card =>
          card.name.toLowerCase().includes(searchTermLower) ||
          card.breed.toLowerCase().includes(searchTermLower) ||
          card.owner_name.toLowerCase().includes(searchTermLower) ||
          card.pet_color.toLowerCase().includes(searchTermLower) ||
          card.phone.toLowerCase().includes(searchTermLower) ||
          card.location.toLowerCase().includes(searchTermLower)
        );

        // Sort cards by name in alphabetical order
        cards.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        return cards;
      }),
    );

  });
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm.next(inputElement.value);
  }

  getNumberOfColumns(): number {
    if (window.innerWidth < 800) {
      return 1;
    } else if (window.innerWidth < 1000) {
      return 2;
    } else if (window.innerWidth < 1200) {
      return 3;
    }
    else if (window.innerWidth < 1500) {
      return 4;
    }
    else if (window.innerWidth < 1700) {
      return 5;
    }
    else  {
      return 6;
    }
  }

  goToPetPage(id: string) {
    this.router.navigate(['/pet', id]);
  }

  toggleFlip(card: any) {
    card.flip = !card.flip;
  }
}
