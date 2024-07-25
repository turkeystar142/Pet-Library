import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { COMPILED_URL } from '../app.component';
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
  private pageIndex = new BehaviorSubject<number>(0);
  private pageSize = new BehaviorSubject<number>(12);
  private searchTerm = new BehaviorSubject<string>('');

  cards!: Observable<Card[]>;
  paginatedCards!: Observable<Card[]>;
  totalCards = 0;
  columns: number = 5;

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
          name: item?.answers?.['23']?.answer ? item?.answers?.['23']?.answer : "N/A", // '23' is the key for the 'Pet Name 1' question
          name2: item?.answers?.['23']?.answer ? item?.answers?.['23']?.answer : "N/A", // '23' is the key for the 'Pet Name 1' question
          pet_type: item?.answers?.['7']?.answer ? item?.answers?.['7']?.answer : "N/A", // '7' is the key for the 'Pet Type' question
          pet_type2: item?.answers?.['7']?.answer ? item?.answers?.['7']?.answer : "N/A", // '7' is the key for the 'Pet Type' question
          breed: item?.answers?.['9']?.answer ? item?.answers?.['9']?.answer : "N/A", // '9' is the key for the 'Breed' question
          breed2: item?.answers?.['9']?.answer ? item?.answers?.['9']?.answer : "N/A", // '9' is the key for the 'Breed' question
          pet_color: item?.answers?.['20']?.answer ? item?.answers?.['20']?.answer : "N/A", // '20' is the key for the 'Pet Color' question
          pet_color2: item?.answers?.['20']?.answer ? item?.answers?.['20']?.answer : "N/A", // '20' is the key for the 'Pet Color' question
          owner_name: item?.answers?.['4']?.prettyFormat ? item?.answers?.['4']?.prettyFormat : "N/A", // '4' is the key for the 'Owner\'s Name' question
          id: item?.id ? item?.id : "0", // 
          location: item?.answers?.['3']?.prettyFormat ? item?.answers?.['3']?.prettyFormat : "N/A", // '3' is the key for the 'Location' question
          pet_photo: item?.answers?.['19']?.answer[0], // '19' is the key for the 'photo' question
          pet_photo2: item?.answers?.['19']?.answer[1], // '19' is the key for the 'photo' question
          email: item?.answers?.['5']?.answer ? item?.answers?.['5']?.answer : "N/A", // '5' is the key for the 'Email' question
          phone: item?.answers?.['6']?.prettyFormat ? item?.answers?.['6']?.prettyFormat : "N/A", // '6' is the key for the 'Phone' question
          cols: 1,
          rows: 1,
          flip: false
        };
        
      });
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

  onPageChange(event: PageEvent) {
    this.pageIndex.next(event.pageIndex);
    this.pageSize.next(event.pageSize);
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
