import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { PetDataService } from '../services/pet-data.service'; 

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
    styleUrls: ['./dash.component.scss'],
    standalone: false
})
export class DashComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
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

  constructor(private router: Router, private petDataService: PetDataService) {
    this.columns = this.getNumberOfColumns();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.columns = this.getNumberOfColumns();
  }

  ngOnInit() {
    this.petDataService.getEntries().subscribe(entries => {
      const data = entries.map(item => ({
        name: item['Pet Name'] || 'N/A',
        pet_type: item['Pet Type'] || 'N/A',
        breed: item['Pet Breed'] || 'N/A',
        pet_color: item['Pet Color'] || 'N/A',
        owner_name: item['Owner Full Name'] || 'N/A',
        id: item['ID'] || '0',
        location: (item['Development'] || '') + ' ' + (item['Unit'] || ''),
        pet_photo: item['Photo'] || '',
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
          card.breed.toLowerCase().includes(searchTermLower) ||
          card.owner_name.toLowerCase().includes(searchTermLower) ||
          card.pet_color.toLowerCase().includes(searchTermLower) ||
          card.pet_type.toLowerCase().includes(searchTermLower) ||
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
