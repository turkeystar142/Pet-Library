import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { API_ENTRIES_URL, API_KEY, BASE_URL_SUBMISSION, COMPILED_URL} from '../app.component';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

interface Card {
  name: string;
  name2: string;
  owner_name: string;
  pet_type: string;
  pet_type2: string;
  breed: string;
  breed2: string;
  pet_color: string;
  pet_color2: string;
  location: string;
  phone: string;
  email: string;
  pet_photo: string;
  pet_photo2: string;
  pet_photo3: string;
  id: string;
  cols: number;
  rows: number;
  flip: boolean;
}

@Component({
    selector: 'app-dash',
    templateUrl: './dash.component.html',
    styleUrls: ['./dash.component.scss'],
    standalone: false
})
export class DashComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private http = inject(HttpClient);
  private dataSubject = new BehaviorSubject<Card[]>([]);
  private pageIndex = new BehaviorSubject<number>(0);
  searchTerm: BehaviorSubject<string>  = new BehaviorSubject<string>('');

  cards!: Observable<Card[]>;
  paginatedCards!: Observable<Card[]>;
  pageSize = new BehaviorSubject<number>(10);
  totalCards = 0;
  columns: number = 5;
  isLoading = true;
  ADD_URL_SUBMISSION!: string;

  constructor(private router: Router) {
    this.columns = this.getNumberOfColumns();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.columns = this.getNumberOfColumns();
  }

  ngOnInit() {
    this.http.get<any[]>(API_ENTRIES_URL).subscribe(entries => {
      const data = entries.map(item => ({
        name: item['Pet Name'] || 'N/A',
        name2: '', // no second pet in new table
        pet_type: item['Pet Type'] || 'N/A',
        pet_type2: '',
        breed: item['Pet Breed'] || 'N/A',
        breed2: '',
        pet_color: item['Pet Color'] || 'N/A',
        pet_color2: '',
        owner_name: item['Owner Full Name'] || 'N/A',
        id: item['ID'] || '0',
        location: (item['Development'] || '') + ' ' + (item['Unit'] || ''),
        pet_photo: item['Photo'] || '',
        pet_photo2: '',
        pet_photo3: '',
        email: item['Email'] || 'N/A',
        phone: item['Phone Number'] || 'N/A',
        cols: 1,
        rows: 1,
        flip: false
      }));
      this.dataSubject.next(data);
    });

    this.cards = combineLatest([ this.breakpointObserver.observe(Breakpoints.Handset), this.searchTerm, this.dataSubject])
      .pipe(
        map(([breakpointState, searchTerm, cards]) => {
          let filteredCards = cards.map(card => ({ ...card, cols: 1, rows: 1, flip: false}));
        
          if (breakpointState.matches) {
            filteredCards = filteredCards.map(card => ({ ...card, cols: 1, rows: 1, flip: false}));
          }
          
          const searchTermLower = searchTerm.toLowerCase();

        // Filter cards based on the search term
        filteredCards = filteredCards.filter(card =>
          card.name.toLowerCase().includes(searchTermLower) ||
          card.name2.toLowerCase().includes(searchTermLower) ||
          card.breed.toLowerCase().includes(searchTermLower) ||
          card.breed2.toLowerCase().includes(searchTermLower) ||
          card.owner_name.toLowerCase().includes(searchTermLower) ||
          card.pet_color.toLowerCase().includes(searchTermLower) ||
          card.pet_color2.toLowerCase().includes(searchTermLower) ||
          card.pet_type.toLowerCase().includes(searchTermLower) ||
          card.pet_type2.toLowerCase().includes(searchTermLower) ||
          card.phone.toLowerCase().includes(searchTermLower) ||
          card.location.toLowerCase().includes(searchTermLower)
        );

        // Sort cards by name in alphabetical order
        filteredCards.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        this.totalCards = filteredCards.length;

        return filteredCards;
      })
    );

    this.paginatedCards = combineLatest([
      this.cards,
      this.pageIndex,
      this.pageSize
    ]).pipe(
      map(([cards, pageIndex, pageSize]) => {
        const startIndex = pageIndex * pageSize;
        const endIndex = startIndex + pageSize;
        return cards.slice(startIndex, endIndex);
      })
    );
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm.next(inputElement.value);
  }

  clearSearch() {
    this.searchTerm.next('');
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.next(event.pageIndex);
    this.pageSize.next(event.pageSize);
    this.paginateCards();
  }

  paginateCards() {
    this.paginatedCards = combineLatest([
      this.cards,
      this.pageIndex,
      this.pageSize
    ]).pipe(
      map(([cards, pageIndex, pageSize]) => {
        const startIndex = pageIndex * pageSize;
        const endIndex = startIndex + pageSize;
        return cards.slice(startIndex, endIndex);
      })
    );
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

  onImageLoad() {
      this.isLoading = false; // Change to false after loading is complete
  }

  // This method is not implemented yet, we don't know if users will have permission/photos to do this
  addPet() {
    // Set the Submission URL for DELTE API call
    // var result = '';
    // this.ADD_URL_SUBMISSION = BASE_URL_SUBMISSION.concat('/', id, '?apiKey=', API_KEY);
    // this.http.post(this.ADD_URL_SUBMISSION, x, x);
    // console.log(result);
    // this.router.navigate(['/dash']);
  }
}
